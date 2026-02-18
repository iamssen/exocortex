import Ajv from 'ajv';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { exit } from 'node:process';

const schemaPath = path.resolve('./schema/body/checkup.json');
const dataDir = path.resolve('./schema/body/checkups');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

console.log(`Found ${files.length} YAML files.`);

let hasError = false;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = yaml.load(fs.readFileSync(filePath, 'utf8'));

  const valid = validate(content);
  if (!valid) {
    console.error(`\n[FAIL] ${file}:`);
    for (const err of validate.errors) {
      console.error(`  - ${err.instancePath} ${err.message}`);

      if (err.keyword === 'additionalProperties') {
        console.error(`    - ${err.params.additionalProperty}`);
      }
    }
    hasError = true;
  } else {
    console.log(`[PASS] ${file}`);
  }
}

if (hasError) {
  exit(1);
}
