import { Switch } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

/**
 * Controla el esquema de color global de Digital ARS.
 *
 * Material UI administra la preferencia seleccionada y su persistencia,
 * por lo que este componente no necesita manejar estado local
 * ni acceder directamente a localStorage.
 */
function AppearanceSwitch() {
  const { mode, setMode } = useColorScheme();

  /**
   * El modo puede ser undefined durante el primer render mientras
   * Material UI determina la preferencia almacenada.
   */
  if (!mode) {
    return null;
  }

  const isDarkMode = mode === "dark";

  const handleChange = (event) => {
    setMode(event.target.checked ? "dark" : "light");
  };

  return (
    <Switch
      edge="end"
      color="primary"
      checked={isDarkMode}
      onChange={handleChange}
      slotProps={{
        input: {
          "aria-label": "Activar modo oscuro",
        },
      }}
    />
  );
}

export default AppearanceSwitch;