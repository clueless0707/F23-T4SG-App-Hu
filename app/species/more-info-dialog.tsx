"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
// import { toast } from "@/components/ui/use-toast";
// import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";
// import { useState, type BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Database } from "@/lib/schema";
import { Label } from "@radix-ui/react-dropdown-menu";

// We use zod (z) to define a schema for the "Add species" form.
// zod handles validation of the input values with methods like .string(), .nullable(). It also processes the form inputs with .transform() before the inputs are sent to the database.

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  total_population: z.number().int().positive().min(1).optional(),
  image: z
    .string()
    .url()
    .nullable()
    .transform((val) => val?.trim()),
});

type FormData = z.infer<typeof speciesSchema>;

const defaultValues: Partial<FormData> = {
  kingdom: "Animalia",
};

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function MoreInfoDialog(species: Species) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Icons.add className="mr-3 h-5 w-5" />
          More Information
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>More Information</DialogTitle>
          <DialogDescription>Below please find more detailed information about this species.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div className="grid w-full items-center gap-4">
              <h4 className="text-lg font-light italic underline">Scientific Name</h4>
              <Label className="text-lg font-light ">{species.scientific_name}</Label>

              <h4 className="text-lg font-light italic underline">Common Name</h4>
              <Label className="text-lg font-light ">{species.common_name}</Label>

              <h4 className="text-lg font-light italic underline">Total Population</h4>
              <Label className="text-lg font-light ">{species.total_population ?? "Not Available"}</Label>

              <h4 className="text-lg font-light italic underline">Kingdom</h4>
              <Label className="text-lg font-light ">{species.kingdom}</Label>

              <h4 className="text-lg font-light italic underline">Description</h4>
              <Label className="text-lg font-light ">{species.description}</Label>

              <h4 className="text-lg font-light italic underline">Author</h4>
              <Label className="text-lg font-light ">{species.author}</Label>

              <div className="flex">
                <Button
                  type="button"
                  className="ml-1 mr-1 flex-auto"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Ok
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
