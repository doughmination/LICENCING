const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(res => rl.question(q, res));
}

function validateVersion(v) {
  return /^\d+\.\d+$/.test(v);
}

function validateUUID(uuid) {
  return /^\d+$/.test(uuid) && uuid.length >= 17;
}

function validateDiscordIdentifier(name) {
  return name.length >= 3;
}

function validateGithub(name) {
  return /^[a-zA-Z0-9-]+$/.test(name);
}

function validateLicenceType(type) {
  return ["locked", "free"].includes(type.toLowerCase());
}

function normalizeDiscordIdentifier(name) {
  name = name.trim().replace(/\s+/g, "");
  if (!name.startsWith("@")) {
    name = "@" + name;
  }
  return name;
}

async function askValidated(question, validator, errorMsg) {
  while (true) {
    const raw = await ask(question);
    const answer = raw.replace(/[\r\n]/g, "").trim();
    if (answer.length === 0 || answer === "0") {
      console.log("You need to give this value.");
      continue;
    }
    if (validator(answer)) return answer;
    console.log(errorMsg);
  }
}

function getNextPermissionId() {

  const year = new Date().getFullYear();
  const files = fs.readdirSync(".");

  let highest = 0;

  for (const file of files) {

    if (!file.endsWith(".md")) continue;

    const content = fs.readFileSync(file, "utf8");

    const match = content.match(/ESAL-DP-(\d{4})-(\d{3})/);

    if (match && parseInt(match[1]) === year) {

      const num = parseInt(match[2]);

      if (num > highest) highest = num;
    }
  }

  const next = highest + 1;

  if (next > 999) {
    throw new Error("Maximum permission count (999) reached for this year.");
  }

  const padded = String(next).padStart(3, "0");

  return {
    short: `${year}-${padded}`,
    full: `ESAL-DP-${year}-${padded}`
  };
}

(async () => {

  const idInfo = getNextPermissionId();

  console.log(`Next Permission ID: ${idInfo.short}`);

  const id = idInfo.full;

  const name = await askValidated(
    "Representative Name: ",
    v => v.trim().length > 0,
    "Name cannot be empty."
  );

  let discord = await askValidated(
    "Discord Identifier: ",
    validateDiscordIdentifier,
    "Discord identifier must be at least 3 characters."
  );

  discord = normalizeDiscordIdentifier(discord);

  const uuid = await askValidated(
    "Discord UUID: ",
    validateUUID,
    "Discord UUID must be digits only and at least 17 characters."
  );

  const github = await askValidated(
    "GitHub Username: ",
    validateGithub,
    "Invalid GitHub username. Letters, numbers, and hyphens only."
  );

  const esalVersion = await askValidated(
    "ESAL Version Granted At (e.g. 1.4): ",
    validateVersion,
    "Invalid version format. Example: 1.4"
  );

  const licenceType = (await askValidated(
    "Licence Type (locked/free): ",
    validateLicenceType,
    "Licence type must be 'locked' or 'free'."
  )).toLowerCase();

  const today = new Date();

  const isoDate = today.toISOString().split("T")[0];

  const readableDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  let conditionBlock;

  if (licenceType === "free") {

    conditionBlock = `1. The authorised party may create a licence derived from or based upon
   the Estrogen Source-Available Licence (ESAL).

2. The attribution and derivative-licence notice requirements described
   in Section 13 of ESAL are waived for the authorised party identified
   in this document.

3. The authorised party is not required to state that their licence is
   derived from ESAL and is not required to credit Clove Nytrix
   Doughmination Twilight.

4. The derivative licence must not claim that Clove Nytrix Doughmination
   Twilight authored the derivative licence itself.

5. This permission applies only to the authorised party identified above
   and may not be transferred, sublicensed, or assigned to another party.`;

  } else {

    conditionBlock = `1. The authorised party may create a licence derived from or based upon
   the Estrogen Source-Available Licence (ESAL).

2. The derivative licence must clearly state that it is derived from
   the Estrogen Source-Available Licence (ESAL).

3. Attribution to Clove Nytrix Doughmination Twilight must be maintained
   in a reasonably visible location within the derivative licence.

4. The derivative licence must not claim that Clove Nytrix Doughmination
   Twilight authored the derivative licence itself.

5. This permission applies only to the authorised party identified above
   and may not be transferred, sublicensed, or assigned to another party.`;

  }

  const content = `Derivative Licence Permission
Estrogen Source-Available Licence (ESAL)

Permission ID
-------------
${id}

Author
------
Clove Nytrix Doughmination Twilight

Authorised Party
----------------
Representative: ${name}

Discord Identifier: ${discord}

Discord UUID: ${uuid}

GitHub Account: [${github}](https://github.com/${github})

Permission Granted
------------------
The authorised party is granted written permission to create a licence
derived from or based upon the Estrogen Source-Available Licence (ESAL).

This permission is granted in accordance with Section 13 of ESAL.

Conditions
----------
${conditionBlock}

Scope
-----
This permission applies solely to the creation and use of a derivative
licence for projects controlled or operated by the authorised party.

This permission is applied to version ${esalVersion} of ESAL, or later,
unless explicitly updated at a later date.

Revocation
----------
Clove Nytrix Doughmination Twilight reserves the right to revoke this
permission at any time.

Modification
------------
Clove Nytrix Doughmination Twilight reserves the right to modify this
permission at any time, provided the Authorised Party is made aware of
any and all modifications.

Date Granted
------------
${readableDate}

Dates Modified
--------------
None as thus far
`;

  const safeName = name.replace(/\s+/g, "");

  const filename = `${isoDate}-${safeName}-ESAL-DP.md`;

  fs.writeFileSync(filename, content);

  console.log(`\nPermission file created: ${filename}`);
  console.log(`Permission ID: ${id}`);

  rl.close();

})();