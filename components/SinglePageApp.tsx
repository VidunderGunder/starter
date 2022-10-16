import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Box, BoxProps } from "@mantine/core";

type Props = {
  // Component props here
} & Omit<ComponentPropsWithoutRef<"div">, "children"> &
  BoxProps;

export default forwardRef<HTMLDivElement, Props>(function SinglePageApp(
  { ...props },
  ref
) {
  // Your logic
  return (
    <Box ref={ref} {...props}>
      {/* 
        Your tags and components here.
      */}
    </Box>
  );
});
