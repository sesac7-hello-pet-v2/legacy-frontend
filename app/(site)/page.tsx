import HeroCarousel from "../components/HeroCarousel";
import AnnouncementCards from "../components/AnnouncementCards";
import FeedCards from "../components/FeedCards";
import NoticeContactSection from "../components/NoticeContactSection";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <AnnouncementCards />
      <FeedCards />
      <NoticeContactSection />
    </div>
  );
}
