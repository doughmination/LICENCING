// Run with node generate-permission.js
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {

  const id = await ask("Permission ID (e.g. ESAL-DP-2026-003): ");
  const name = await ask("Representative Name: ");
  const discord = await ask("Discord Identifier: ");
  const uuid = await ask("Discord UUID: ");
  const github = await ask("GitHub Username: ");
  const date = await ask("Date Granted (e.g. 28 March 2026): ");
  const licenceType = await ask("Licence Type (locked/free): ");

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

GitHub Account: https://github.com/${github}

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

Revocation
----------
Clove Nytrix Doughmination Twilight reserves the right to revoke this
permission at any time.

Modification
------------
Clove Nytrix Doughmination Twilight reserves the right to modify this
permission at any time, provided the authorised party is made aware of
any modifications.

Date Granted
------------
${date}

Dates Modified
--------------
None as thus far
`;

  const filename = `${date.replace(/ /g, "-")}-${name.replace(/ /g, "")}-ESAL-DP.md`;

  fs.writeFileSync(filename, content);

  console.log(`\nPermission file created: ${filename}`);

  rl.close();

})();
