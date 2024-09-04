import React, { useState } from "react";
import { FaHouseUser, FaUsers } from "react-icons/fa";
import Avatar from "react-avatar";
import { IoCopy, IoExit } from "react-icons/io5";

function Sidebar({ clients, host }) {
  return (
    <div>
      <div className="flex h-screen flex-col justify-between border-e bg-[#22252c]">
        <div className="px-4 py-6">
          <div className="flex items-center justify-center pb-4 border-b border-gray-600">
            <img src="/logo.png" alt="logo" className="w-36" />
          </div>
          <div className="pb-4 border-b border-gray-600">
            <h1 className="text-lg font-semibold tracking-wide rounded text-black mt-4 bg-[#d6fb41] flex items-center justify-center gap-2 p-1">
              <FaHouseUser />
              Host
            </h1>
            <div className="flex flex-col justify-center items-center mt-4">
              <Avatar name={host} size="40" round="14px" />
              <p className="text-white font-semibold font-mono">{host}</p>
            </div>
          </div>
          <div className="pb-4 border-b border-gray-600">
            <h1 className="text-lg font-semibold tracking-wide rounded text-black mt-4 bg-[#d6fb41] flex items-center justify-center gap-2 p-1">
              <FaUsers className="text-xl" />
              Joined
            </h1>
            <div className="mt-4 flex items-center justify-evenly gap-2 flex-wrap">
              {clients?.map((client) =>
                client?.username !== host ? (
                  <div className="flex flex-col justify-center items-center">
                    <Avatar
                      name={client?.username}
                      size="40"
                      round="14px"
                      color={Avatar.getRandomColor("sitebase", ["blue"])}
                    />
                    <p className="text-white font-semibold font-mono">
                      {client?.username}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-700 p-4">
          <button className="w-full bg-lime-100 text-black px-4 py-2 mb-2 rounded flex items-center justify-center gap-2 font-semibold hover:bg-lime-200 duration-200">
            Copy Room Id
            <IoCopy />
          </button>
          <button className="w-full bg-transparent border text-white px-4 py-2 rounded flex items-center justify-center gap-2 font-semibold hover:bg-gray-900 duration-200">
            Exit
            <IoExit className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
