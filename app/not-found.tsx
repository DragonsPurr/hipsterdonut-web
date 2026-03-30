import Image from "next/image";
import Link from "next/link";
import { asset_base_url } from "@/app/lib/constants";

export default function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="dp-page-header">
        <strong>Page Not Found</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative w-[75%] max-w-md aspect-4/3">
          <Image
            src={`${asset_base_url}/eeby-deeby-404.jpg`}
            alt="404"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 28rem"
          />
        </div>
        <div className="dp-body-text">
          Oh No, You seem to have taken a wrong turn.<br />
          <Link href="/" className="text-red-600 hover:text-red-600">Go back to the home page</Link>
        </div>
      </div>
    </div>
  );
}
