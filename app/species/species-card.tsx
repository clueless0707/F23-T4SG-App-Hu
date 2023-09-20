"use client";

import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
import Image from "next/image";

import EditSpeciesDialog from "./edit-species-dialog";
import MoreInfoDialog from "./more-info-dialog";

import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Species = Database["public"]["Tables"]["species"]["Row"];

import { Button } from "@/components/ui/button";
// import console from "console";
import React from "react";

interface SpeciesCardProps {
  userId: string;
  species: Species;
  // add other additional props here, if needed
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ userId, species }) => {
  const router = useRouter();

  const onDelete = () => {
    (async () => {
      const supabase = createClientComponentClient<Database>();
      try {
        await supabase.from("species").delete().eq("id", species.id);
      } catch {
        // console.error("An error has occurred", err);
        toast({
          title: "delete result: {$result}.",
          variant: "destructive",
        });
      }

      router.refresh();
    })().catch((err) =>
      toast({
        title: `Something went wrong: ${err}`,
        variant: "destructive",
      }),
    );
  };

  const renderOption = () => {
    if (userId != species.author) {
      return <MoreInfoDialog key={species.id} {...species} />;
    } else {
      return (
        <div>
          <div>
            <EditSpeciesDialog key={species.id} species={species} />
          </div>
          <Button variant="secondary" onClick={onDelete}>
            <Icons.trash className="mr-3 h-5 w-5" />
            Delete Species
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace with detailed view */}
      {/* <Button className="mt-3 w-full">Learn More</Button> */}
      <div>{renderOption()}</div>
    </div>
  );
};

export default SpeciesCard;
