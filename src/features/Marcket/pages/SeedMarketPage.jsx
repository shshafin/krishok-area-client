import { useState, useEffect, useCallback } from "react";
import MarketCard from "@/components/ui/MarketCard";
import MarketModal from "@/components/ui/MarketModal";
import MarketCreateModal from "@/components/ui/MarketCreateModal";
import AddPost from "@/assets/icons/add.png";

export default function SeedMarketPage() {
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // simulate fetch
    const dummy = Array.from({ length: 80 }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/seed/${i}/400/250`,
      timeText: `${i + 1} minutes ago`,
      timeTitle: "Time info",
      title: `বাজার ${i + 1} আপডেট`,
      description: `পণ্য ${i + 1} এর দাম পরিবর্তন হয়েছে।`,
    }));
    setItems(dummy.slice(0, 30));
  }, []);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setItems((prev) => {
          const more = prev.length + 20;
          return prev.length < 80
            ? prev.concat(
                Array.from({ length: 20 }, (_, j) => ({
                  id: prev.length + j + 1,
                  image: `https://picsum.photos/seed/${
                    prev.length + j
                  }/400/250`,
                  timeText: `${prev.length + j + 1} minutes ago`,
                  timeTitle: "Time info",
                  title: `বাজার ${prev.length + j + 1} আপডেট`,
                  description: `পণ্য ${
                    prev.length + j + 1
                  } এর দাম পরিবর্তন হয়েছে।`,
                }))
              )
            : prev;
        });
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCard = useCallback(
    (id) => {
      const found = items.find((i) => i.id === id);
      setSelected(found);
      setOpenModal(true);
    },
    [items]
  );

  return (
    <div className="daily_bxp45">
      <div class="photo-body-box">
        <h4 class="">আপনার স্বপ্ন ফলানো বীজ ক্রয়-বিক্রয় করুন</h4>
      </div>

      <div className="dxKXr_mboX74">
        {/* Create Button */}
        <button
          className="cbtn_minx_dbpx58"
          onClick={() => setCreateOpen(true)}
        >
          <div className="cbtn_dixbp_xr5">
            <div className="cbtn_minxi_imgsesalesx45x">
              <img src={AddPost} alt="Add items" />
            </div>
            <div className="cbtn_minxd_imagxds46">
              <h4>বীজ বাজার যোগ করুন</h4>
            </div>
          </div>
        </button>

        {/* Items */}
        {items.map((it) => (
          <MarketCard key={it.id} {...it} onClick={openCard} />
        ))}
      </div>

      {/* View Modal */}
      <MarketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        name="username"
        location="রাজশাহী"
        image="https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
        priceImage={selected?.image}
        contact="01998604895 এই নাম্বারে যোগাযোগ করুন"
        description={selected?.description || "No Descriptions"}
      />

      {/* Create Modal */}
      <MarketCreateModal
        title="বীজ যোগ করুন"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        user={{
          id: "newnamespaceojkasldkfl",
          name: "username",
          img: "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setCreateOpen(false);
        }}
      />
    </div>
  );
}
