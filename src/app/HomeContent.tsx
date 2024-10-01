"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Cookies from 'js-cookie';

import ItemList from "./(s3)/ItemList";

export default function HomeContent() {
  const [hasToken, setHasToken] = useState<Boolean>();
  useEffect(() => {
    setHasToken(Cookies.get("TOKEN") !== undefined); 
  }, []);

  if (hasToken) {
    return <ItemList />
  } else if (hasToken === false) {
    redirect("/login");
  } else {
    return null;
  }
}
