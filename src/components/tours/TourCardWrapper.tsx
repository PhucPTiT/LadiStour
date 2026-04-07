import { Tour } from "@/service/tour/type";
import TourCardClient from "./TourCardClient";

type TourCardWrapperProps = {
    tour: Tour;
};

export default function TourCardWrapper({ tour }: TourCardWrapperProps) {
    return <TourCardClient tour={tour} />;
}
