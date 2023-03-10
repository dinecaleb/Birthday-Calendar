

import { Skeleton } from "@mui/material";
import React from "react";

export default function BirthdaysLoading() {
  return (
    <div className="w-full">
      {[...Array(7)].map((elementInArray, index) => (
        <div key={index + "loading"} className="mb-4">
          <Skeleton variant="rectangular" height={60} />
        </div>
      ))}
    </div>
  );
}
