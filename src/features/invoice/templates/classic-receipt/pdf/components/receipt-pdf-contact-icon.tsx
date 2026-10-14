import { Circle, Path, Svg } from "@react-pdf/renderer";

type ReceiptPdfContactIconName = "phone" | "mail" | "website" | "address";

interface ReceiptPdfContactIconProps {
  name: ReceiptPdfContactIconName;
  size: number;
}

const ICON_BACKGROUNDS: Record<ReceiptPdfContactIconName, string> = {
  phone: "#16A34A",
  mail: "#2563EB",
  website: "#0891B2",
  address: "#DC2626",
};

function IconGlyph({ name }: { name: ReceiptPdfContactIconName }) {
  if (name === "phone") {
    return (
      <Path
        d="M8.4 5.6c.5-.5 1.3-.5 1.8 0l1.7 1.7c.4.4.5 1.1.1 1.6l-1 1.4c-.2.3-.2.7 0 1 1.1 1.8 2.6 3.3 4.4 4.4.3.2.7.2 1 0l1.4-1c.5-.4 1.2-.3 1.6.1l1.7 1.7c.5.5.5 1.3 0 1.8l-1.1 1.1c-1 1-2.5 1.3-3.8.7-2.6-1.2-5-2.9-7.1-5s-3.8-4.5-5-7.1c-.6-1.3-.3-2.8.7-3.8l1.1-1.1Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.8}
      />
    );
  }

  if (name === "mail") {
    return (
      <>
        <Path d="M5 7.5h14v9H5z" fill="none" stroke="#FFFFFF" strokeWidth={1.7} />
        <Path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="#FFFFFF" strokeWidth={1.7} />
      </>
    );
  }

  if (name === "website") {
    return (
      <>
        <Circle cx={12} cy={12} r={6.5} fill="none" stroke="#FFFFFF" strokeWidth={1.5} />
        <Path d="M5.5 12h13M12 5.5c2 2 2.8 4.2 2.8 6.5S14 16.5 12 18.5M12 5.5C10 7.5 9.2 9.7 9.2 12s.8 4.5 2.8 6.5" fill="none" stroke="#FFFFFF" strokeWidth={1.35} />
      </>
    );
  }

  return (
    <>
      <Path d="M12 20s5.5-5.2 5.5-10A5.5 5.5 0 0 0 6.5 10c0 4.8 5.5 10 5.5 10Z" fill="none" stroke="#FFFFFF" strokeWidth={1.6} />
      <Circle cx={12} cy={10} r={1.8} fill="none" stroke="#FFFFFF" strokeWidth={1.5} />
    </>
  );
}

export function ReceiptPdfContactIcon({ name, size }: ReceiptPdfContactIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={ICON_BACKGROUNDS[name]} />
      <IconGlyph name={name} />
    </Svg>
  );
}
