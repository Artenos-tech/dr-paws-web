import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

export default function ProfileDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center">
        <Image
          src="/assets/images/profileThumnail.svg"
          alt="User logo"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-[#f7f1de] shadow-lg rounded-lg w-48 p-4 flex flex-col gap-1"
          align="start"
          sideOffset={5}
        >
          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            asChild
            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none "
          >
            <Link href="/user/profile" className="">
              My Pets
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            Medical History
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            My Appointments
          </DropdownMenu.Item>

          <div className="border-t border-gray-300 my-2" />

          <DropdownMenu.Item className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer">
            Become a Member <MdChevronRight />
          </DropdownMenu.Item>

          <div className="border-t border-gray-300 my-2" />

          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            Billing Information
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            Account Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
            Log Out
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
