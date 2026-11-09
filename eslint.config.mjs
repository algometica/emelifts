import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'prisma/dev.db'] },
  ...nextVitals,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
