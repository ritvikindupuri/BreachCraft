export const templates = [
  {
    name: 'Linux Bash TCP',
    values: {
      os: 'Linux',
      architecture: 'x64',
      availableTools: 'bash, /dev/tcp',
      scriptingLanguage: 'bash',
    },
  },
  {
    name: 'Windows PowerShell',
    values: {
      os: 'Windows',
      architecture: 'x64',
      availableTools: 'powershell, System.Net.Sockets.TCPClient',
      scriptingLanguage: 'powershell',
    },
  },
  {
    name: 'Python Universal',
    values: {
      os: 'Linux',
      architecture: 'x64',
      availableTools: 'python',
      scriptingLanguage: 'python',
    },
  },
  {
    name: 'Netcat',
    values: {
      os: 'Linux',
      architecture: 'x64',
      availableTools: 'nc, sh',
      scriptingLanguage: 'netcat',
    },
  },
    {
    name: 'Ruby',
    values: {
      os: 'Linux',
      architecture: 'x64',
      availableTools: 'ruby',
      scriptingLanguage: 'ruby',
    },
  },
  {
    name: 'PHP',
    values: {
      os: 'Linux',
      architecture: 'x64',
      availableTools: 'php',
      scriptingLanguage: 'php',
    },
  },
];
