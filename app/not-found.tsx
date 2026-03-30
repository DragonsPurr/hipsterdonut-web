import Image from "next/image";
import Link from "next/link";
import { alt_base_url } from "@/app/lib/constants";

export default function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="hd-page-header">
        <strong>Page Not Found</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative max-w-md aspect-4/3">
          <Image
            src={`${alt_base_url}/eeby-deeby-404.jpg`}
            alt="404"
            fill
            className="object-contain drop-shadow-[4px_4px_8px_rgb(0_0_0)]"
            sizes="(max-width: 768px) 50vw, 28rem"
          />
        </div>
        <div className="hd-body-text-bold">
          Oh No, You seem to have taken a wrong turn.<br />
          <Link href="/" className="hd-link">Go back to the home page</Link>
        </div>
      </div>
    </div>
  );
}
