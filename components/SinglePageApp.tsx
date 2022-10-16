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
      Your Single Page Application here. <br />
      When you want to move to having multiple pages, you can look into how{" "}
      <a href="https://nextjs.org/learn/foundations/about-nextjs?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=next-website">
        Next.js
      </a>{" "}
      works.
    </Box>
  );
});
