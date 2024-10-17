const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const packageJson = require('../package.json');
const Schedule = require('./Schedule');

program
  .version(packageJson.version)
  .option('-c, --config <path>', 'path to the config file')
  .option('-t, --template <path>', 'path to the template file')
  .parse();

const options = program.opts();

function readConfig() {
  let configPath;
  if (options.config) {
    configPath = path.resolve(options.config);
    if (!fs.existsSync(configPath)) {
      console.error('Error: Config file `' + configPath + '` does not exist');
      return null;
    }
  } else {
    configPath = path.resolve('.redmine-hours.config.json');
    if (!fs.existsSync(configPath)) {
      configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.redmine-hours.config.json');
    }
    if (!fs.existsSync(configPath)) {
      console.error('Error: No config file found');
      return null;
    }
  }

  const configText = fs.readFileSync(configPath, 'utf8');
  try {
    return JSON.parse(configText);
  } catch (error) {
    console.error('Error: Failed to parse config file' );
    return null;
  }
}

function pushLog(issueId, date, hours, comments, config) {
  fetch(`${config.API_URL}/time_entries.json`, {
    method: 'POST',
    headers: {
      'X-Redmine-API-Key': config.API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      time_entry: {
        issue_id: issueId,
        hours: hours,
        spent_on: date,
        comments: comments,
      },
    }),
  })
    .then(() => {
      console.log(`Logged ${hours} hours on issue #${issueId} for ${date}`);
    })
    .catch(() => {
      console.log(`Error: Failed to log ${hours} hours on issue #${issueId} for ${date}`);
    });
}

function main() {
  const config = readConfig();

  if (!config) {
    process.exit(1);
  }

  const templatePath = options.template || './template.txt';

  if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file \`${templatePath}\` does not exist`);
    process.exit(1);
  }

  fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: Failed to read template file');
      return;
    }

    const schedule = new Schedule();
    const lines = data.split('\n');
    const [issueId, ...rows] = lines;

    rows
      .filter((row) => row.trim() !== '')
      .forEach((row) => {
        const [date, hours, comments] = row.split(' ');
        if (date && hours && comments) {
          schedule.addTask(() => {
            pushLog(issueId.slice(1), date, hours, comments, config);
          });
        }
      });
  });
}

main();
