import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteIcon from '@mui/icons-material/Note'; // Import the Note icon
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import LogoImg from "./images/Go100xLogo.png"; // Ensure the path is correct
import Notes from './Notes'; // Ensure the Notes component is imported

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'notes', // Updated segment
    title: 'Notes', // Updated title
    icon: <NoteIcon />, // Use Note icon
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Ensure it takes up full height
        textAlign: 'center',
        padding: '0 16px', // Add horizontal padding
      }}
    >
      <Typography variant="h4" style={{ marginBottom: '16px' }}>
        Welcome to Go100x
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '16px' }}>
        Dashboard content for {pathname}
      </Typography>
      <Notes /> {/* Integrate your Notes component here */}
    </div>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={LogoImg} alt="Go100x logo" />, // Correctly use the logo as an image element
        title: 'Go100x',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
