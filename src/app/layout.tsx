import {
  ColorSchemeScript,
  createTheme,
  MantineColorsTuple,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import '@mantine/core/styles.css';

import './global.css';

export const metadata = {
  title: 'Roses Radio',
  description: 'I broadcast the sounds',
};

const rosesRed: MantineColorsTuple = [
  '#ffebe8',
  '#ffd6d2',
  '#f8aca4',
  '#f27f72',
  '#ed5948',
  '#ea402d',
  '#ea331f',
  '#d02513',
  '#ba1e0f',
  '#a31208'
];

const theme = createTheme({
  colors: {
    rosesRed,
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
