import DonationEvents from "../../pages/Donor/DonationEvents";
import TextToSpeech from "../../components/TextToSpeech";

export default function Home() {
  return(
    <>
      <TextToSpeech text={'John has redeemed 5 dollars.'} play={true}/>
      <DonationEvents />;
    </>
  ) 
};
