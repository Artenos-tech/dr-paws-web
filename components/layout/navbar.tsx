import logo from "@/app/assets/images/logo/logo.svg";
import Image from "next/image";

export default function NavBar() {
  return (
    <div className="navbar bg-primary-3">
      <div className="navbar-end px-8">
        <Image
          src={logo}
          alt="Dr. Paws Logo"
          width={100}
          height={30}
          priority
        />
      </div>
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-start px-8">
        <a className="btn">Button</a>
      </div>
    </div>
  );
}
