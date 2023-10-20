import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import GamingProducts from "./GamingProducts";
import Title from "@/components/common/componentTitle/Title";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const GamingZone = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const commonStyle = {
    marginRight: "6px",
    "&.Mui-selected": {
      backgroundColor: "#f15700",
      color: "#ffffff",
      transitionDuration: "0.7s",
    },
  };
  const commonClass = `bg-input text-black font-medium p-1 md:p-3 text-sm`;

  return (
    <Box className="w-full mb-16">
      <Title title={"Gaming Zone"} />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Controllers"
            {...a11yProps(1)}
            sx={commonStyle}
            className={commonClass}
          />
          <Tab
            label="Consoles"
            {...a11yProps(0)}
            sx={commonStyle}
            className={commonClass}
          />
          <Tab
            label="Headphones"
            {...a11yProps(2)}
            sx={commonStyle}
            className={commonClass}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GamingProducts param="CONTROLLER" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GamingProducts param="CONSOLE" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <GamingProducts param="HEADPHONE" />
      </CustomTabPanel>
    </Box>
  );
};

export default GamingZone;
