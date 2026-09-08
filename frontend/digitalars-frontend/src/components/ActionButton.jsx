import { IconButton, Tooltip } from "@mui/material";

function ActionButton({
  title,
  disabled,
  color = "default",
  onClick,
  children,
  ...props
}) {
  const button = (
    <span>
      <IconButton
        size="small"
        color={color}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </IconButton>
    </span>
  );

  return title ? <Tooltip title={title}>{button}</Tooltip> : button;
}

export default ActionButton;
