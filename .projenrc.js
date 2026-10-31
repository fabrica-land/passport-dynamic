const fs = require('fs');
const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@dynamic-labs/passport-dynamic',
  license: 'MIT',
  copyrightOwner: 'Dynamic Labs',
  copyrightPeriod: '2024',

  deps: ['passport-strategy', 'jsonwebtoken@^9.0.2'],

  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'supertest@^6.2.3',
    '@types/supertest',
    '@types/passport',
    '@types/passport-strategy',
    '@types/jsonwebtoken@^9.0.2',
    '@types/express@4.17.13',
    'keypair',
    'express',
    'passport',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  releaseToNpm: true,
  repository: 'https://github.com/dynamic-labs/passport-dynamic.git',
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://registry.npmjs.org',
  packageManager: 'npm',
});

// Keep the CA checks in the generator so self-mutation preserves them.
const caTrustFix = {
  name: 'ENG-5167 CA trust fix (remove emSign ECC Root CA - G3)',
  shell: 'bash',
  run: "set +e -uo pipefail\nB=/etc/ssl/certs/ca-certificates.crt\nG3=86a1ecba089c4a8d3bbe2734c612ba341d813e043cf9e8a862cd5c57a36bbe6b\nX1=96bcec06264976f37460779acf28c5a7cfe8a3c0aae11a8ffcee05c0bddf08c6\nfps() { awk '/-----BEGIN CERTIFICATE-----/{c=\"openssl x509 -noout -fingerprint -sha256\"} c{print | c} /-----END CERTIFICATE-----/{close(c); c=\"\"}' \"$B\" | sed 's/^.*=//; s/://g' | tr 'A-F' 'a-f'; }\nif [ \"$(fps | grep -c -x \"$G3\")\" != 0 ]; then\n  echo \"ENG5167 G3 present: upgrading ca-certificates\"\n  sudo apt-get update -qq && sudo apt-get install -y -qq --only-upgrade ca-certificates\nfi\ndpkg-query -W ca-certificates\nFP=$(fps)\nN=$(printf '%s\\n' \"$FP\" | grep -c .)\nPEM=$(grep -c 'BEGIN CERTIFICATE' \"$B\")\nG3N=$(printf '%s\\n' \"$FP\" | grep -c -x \"$G3\")\nX1N=$(printf '%s\\n' \"$FP\" | grep -c -x \"$X1\")\necho \"ENG5167 certs=${N} pem_blocks=${PEM} g3_sha256_count=${G3N} isrg_x1_sha256_count=${X1N}\"\nif [ \"$G3N\" = 0 ] && [ \"$X1N\" -ge 1 ] && [ \"$N\" = \"$PEM\" ]; then echo \"ENG5167 MET\"; else echo \"ENG5167 NOT-MET\"; exit 1; fi\n",
};
const workflowJobs = {
  'build': ['build', 'self-mutation'],
  'pull-request-lint': ['validate'],
  'upgrade-main': ['upgrade', 'pr'],
  'release': ['release', 'release_github', 'release_npm'],
};
const artifactPins = {
  'actions/upload-artifact': ['ea165f8d65b6e75b540449e92b4886f43607fa02', 'v4.6.2'],
  'actions/download-artifact': ['d3f86a106a0bac45b974a628896c90dbdf5c8093', 'v4.3.0'],
};
for (const [action, [sha]] of Object.entries(artifactPins)) {
  project.github.actions.set(action, `${action}@${sha}`);
}
project.synth();
// Patch generated YAML here so every projen run preserves the CA checks.
const YAML = require(require.resolve('yaml', { paths: [require.resolve('projen')] }));
for (const [name, jobIds] of Object.entries(workflowJobs)) {
  const path = `.github/workflows/${name}.yml`;
  const document = YAML.parseDocument(fs.readFileSync(path, 'utf8'));
  for (const id of jobIds) {
    const steps = document.getIn(['jobs', id, 'steps']);
    steps.items.unshift(document.createNode(caTrustFix));
    for (const step of steps.items) {
      const uses = step.get('uses');
      if (!uses) continue;
      for (const [action, [sha, tag]] of Object.entries(artifactPins)) {
        if (uses === `${action}@${sha}`) step.get('uses', true).comment = ` ${tag}`;
      }
      if (uses.startsWith('actions/upload-artifact@')) {
        step.setIn(['with', 'include-hidden-files'], true);
      }
    }
  }
  fs.chmodSync(path, 0o644);
  fs.writeFileSync(path, document.toString({ lineWidth: 0 }));
}
