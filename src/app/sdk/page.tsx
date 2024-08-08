"use client";
import { generateTextAction, describeImage } from "@/actions/form";
import { useState } from "react";

export default function Page() {
  const [generation, setGeneration] = useState("");
  const [image, setImage] = useState("");
  const [object, setObject] = useState({});
  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={async () => {
            const result = await generateTextAction();
            setGeneration(result);
          }}
        >
          tell me a joke
        </button>
        <pre>{JSON.stringify(generation, null, 2)}</pre>
      </div>
      <div>
        <button
          onClick={async () => {
            const result = await describeImage();
            setImage(result);
          }}
        >
          describe image
        </button>
        <pre>{JSON.stringify(image, null, 2)}</pre>
      </div>
    </div>
  );
}
/* https://www.youtube.com/watch?v=UDm-hvwpzBI */
