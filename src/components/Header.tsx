import { Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  brand?: string;
  image?: string;
}

export function Header({ brand = "konectados", image }: HeaderProps) {
  const currentTime = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header
      className={`
        text-white
        bg-slate-800
        border-b-4 ${
        brand != "AUTOMATICO"
        ? "border-b-orange-500"
        : "border-emerald-500"
        }
        shadow-lg
      `}
    >
      <div
        className="
          container
          mx-auto px-4 py-4
          sm:px-6
        "
      >
        <div
          className="
            flex
            items-center justify-between
          "
        >
          <div
            className="
              flex
              items-center gap-4
            "
          >
            <div
              className="
                flex
                items-center gap-3
              "
            >
              <div
                className={`
                  flex
                  w-12 h-12
                  rounded-xl
                  shadow-xl
                  items-center justify-center ring-2 ring-emerald-400/30
                  ${
                  brand !== "AUTOMATICO"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 hover:from-orange-600 hover:to-orange-700 hover:border-orange-600"
                  : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                  }
                `}
              >
                <Phone
                  className="
                    w-7 h-7
                    text-white
                    drop-shadow-sm
                  "
                />
              </div>
              <div
                className="
                  hidden
                  md:block
                "
              >
                <h1
                  className="
                    text-xl font-bold tracking-tight text-transparent
                    bg-gradient-to-r from-white to-slate-200 bg-clip-text
                  "
                >
                  CallCenter Konectados
                </h1>
                <p
                  className="
                    text-sm text-slate-300 font-medium
                  "
                >
                  Sistema Avanzado de Gestión
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className={`
                ml-4 px-4 py-2
                font-semibold text-white
                transition-all
                ${
                brand !== "AUTOMATICO"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 hover:from-orange-600 hover:to-orange-700 hover:border-orange-600"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 hover:from-emerald-600 hover:to-emerald-700 hover:border-emerald-600"
                }
              `}
            >
              <div
                className={`
                  w-2 h-2
                  mr-2
                  rounded-full
                  animate-pulse shadow-sm
                  ${brand !== "AUTOMATICO" ? "bg-orange-200" : "bg-emerald-200"}
                `}
              ></div>
              CRM {brand}
            </Button>
          </div>

          <div
            className="
              flex
              text-sm
              items-center gap-x-3 justify-center
            "
          >
            <div
              className="
                hidden
                px-4 py-2
                text-slate-200
                bg-slate-700/80
                rounded-lg border border-slate-600/50
                shadow-md
                items-center gap-2 backdrop-blur-sm
                xl:flex
              "
            >
              <User
                className="
                  w-4 h-4
                  text-emerald-400
                "
              />
              <span
                className="
                  font-medium
                "
              >
                Sesión: {currentTime}
              </span>
            </div>

            <Avatar
              className="
                overflow-hidden
                w-14 h-14
                bg-white
                border border-blue-400/30 rounded-full
                shadow-md
                /* más grande que antes */ /* círculo perfecto */ /* asegura que la imagen no se salga */
              "
            >
              <AvatarImage
                src={image}
                alt={brand}
                className="
                  object-cover
                  w-full h-full
                  /* llena todo el círculo */
                "
              />
              <AvatarFallback
                className="
                  text-blue-600 font-bold
                  bg-white
                "
              >
                {brand?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <Badge
              variant="secondary"
              className={`
                hidden
                px-4 py-2
                text-white font-semibold
                shadow-md transition-all
                hover:shadow-lg duration-200
                sm:block
                ${
                brand !== "AUTOMATICO"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 hover:from-orange-600 hover:to-orange-700 hover:border-orange-600"
                : "bg-gradient-to-r from-teal-700 to-teal-600 border border-orange-400/30"
                }
              `}
            >
              Ejecutivo
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
