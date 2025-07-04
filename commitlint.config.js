export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'build',
        'ci',
        'revert'
      ]
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
    'header-max-length': [2, 'always', 100]
  }
};
