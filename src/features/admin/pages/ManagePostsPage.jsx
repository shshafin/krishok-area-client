import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Video } from "yet-another-react-lightbox/plugins";
import DeleteOutlineIcon from "@/assets/IconComponents/DeleteOutlineIcon";
import HeartOutlineIcon from "@/assets/IconComponents/HeartOutlineIcon";
import CommentBubbleIcon from "@/assets/IconComponents/CommentBubbleIcon";

const PAGE_SIZE = 5;

const RAW_POSTS = [
  {
    id: "post-1",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-10-12T16:05:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1598514982833-3260f9892ab2?auto=format&fit=crop&w=1200&q=60",
    text: "কৃষকের নতুন ধানক্ষেতে পোকামাকড় দমনে জৈব সমাধানের পরীক্ষা চলছে।",
    likes: 18,
    comments: 6,
    location: "Rajshahi, Bangladesh",
  },
  {
    id: "post-2",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-10-10T10:30:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
    text: "আলুর গাছের রোগ শনাক্তকরণ এবং দ্রুত সমাধানের গাইড ভিডিও।",
    likes: 12,
    comments: 4,
    location: "Dhaka, Bangladesh",
  },
  {
    id: "post-3",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522206024047-9c925421675b?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-09-25T08:45:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1598514983120-6a02970f580b?auto=format&fit=crop&w=1200&q=60",
    text: "বাজারে সংগৃহীত তাজা শাকসবজি, কৃষকের পরিশ্রমের ফল।",
    likes: 7,
    comments: 2,
    location: "Sylhet, Bangladesh",
  },
  {
    id: "post-4",
    user: {
      name: "Krishok Ami",
      username: "krishokami1",
      avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-09-11T14:10:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    text: "ড্রোন ব্যবহার করে জমিতে সার ও বালাইনাশক প্রয়োগের লাইভ ডেমো।",
    likes: 24,
    comments: 9,
    location: "Comilla, Bangladesh",
  },
  {
    id: "post-5",
    user: {
      name: "Md. Shihab Ali",
      username: "mdshihabali",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-08-19T09:30:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60",
    text: "নতুন বাঁধাকপি প্লটের অগ্রগতির আপডেট শেয়ার করা হলো।",
    likes: 11,
    comments: 3,
    location: "Pabna, Bangladesh",
  },
  {
    id: "post-6",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-08-01T12:45:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
    text: "ধানের নতুন জাতের ফলন কেমন হচ্ছে দেখে নিন মাঠের ছবিতে।",
    likes: 30,
    comments: 11,
    location: "Gazipur, Bangladesh",
  },
  {
    id: "post-7",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-07-23T16:00:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Footvolley.mp4",
    text: "কৃষিক্ষেত্রে পানি সাশ্রয়ী স্প্রিঙ্কলার ব্যবহারের উপর সংক্ষিপ্ত ভিডিও।",
    likes: 8,
    comments: 1,
    location: "Khulna, Bangladesh",
  },
  {
    id: "post-8",
    user: {
      name: "Konika Mk",
      username: "santonakonikamk.SA",
      avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-07-10T06:12:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=60",
    text: "বাগানের সেচ ব্যবস্থায় সেন্সর ভিত্তিক স্বয়ংক্রিয়তা যোগ করা হয়েছে।",
    likes: 16,
    comments: 5,
    location: "Chittagong, Bangladesh",
  },
  {
    id: "post-9",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-06-21T18:22:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Typing.mp4",
    text: "কৃষিভিত্তিক স্টার্টআপের আপডেট, কীভাবে স্মার্ট সেন্সর দিয়ে ডেটা সংগ্রহ করি।",
    likes: 20,
    comments: 7,
    location: "Barishal, Bangladesh",
  },
  {
    id: "post-10",
    user: {
      name: "Krishok Ami",
      username: "krishokami1",
      avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-06-05T04:18:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60",
    text: "বোরো মৌসুমে জৈব সার ব্যবহারের ফলাফল - মাঠ থেকেই ছবি।",
    likes: 9,
    comments: 2,
    location: "Mymensingh, Bangladesh",
  },
  {
    id: "post-11",
    user: {
      name: "Md. Shihab Ali",
      username: "mdshihabali",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-05-22T11:35:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    text: "কস্ট-ইফেক্টিভ গ্রিনহাউস তৈরির প্রক্রিয়ার ধাপগুলো শেয়ার করা হলো।",
    likes: 5,
    comments: 1,
    location: "Jessore, Bangladesh",
  },
  {
    id: "post-12",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-05-10T13:12:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Lonely-Tiger.mp4",
    text: "প্রশিক্ষণ মাঠে উন্নত কৃষি যন্ত্রের ব্যবহার শেখানো হচ্ছে।",
    likes: 14,
    comments: 3,
    location: "Faridpur, Bangladesh",
  },
  {
    id: "post-13",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-04-28T15:05:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=60",
    text: "কৃষকদের ডিজিটাল প্রশিক্ষণের নতুন ব্যাচ শুরু হলো আজ।",
    likes: 27,
    comments: 8,
    location: "Rangpur, Bangladesh",
  },
  {
    id: "post-14",
    user: {
      name: "Konika Mk",
      username: "santonakonikamk.SA",
      avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-04-12T09:55:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Tree-In-The-Forest.mp4",
    text: "গ্রিনহাউসে চাষকৃত নতুন জাতের টমেটোর বৃদ্ধি পর্যবেক্ষণ করছি।",
    likes: 10,
    comments: 4,
    location: "Narayanganj, Bangladesh",
  },
  {
    id: "post-15",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-03-28T07:43:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=60",
    text: "চালের বৈচিত্র্য ধরে রাখতে পুরাতন ধানের বীজ সংরক্ষণের উদ্যোগ।",
    likes: 6,
    comments: 2,
    location: "Gaibandha, Bangladesh",
  },
  {
    id: "post-16",
    user: {
      name: "Md. Shihab Ali",
      username: "mdshihabali",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-03-05T05:55:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=60",
    text: "স্থল কৃষির পাশাপাশি ভাসমান বাগানের পরীক্ষামূলক ছবি।",
    likes: 9,
    comments: 3,
    location: "Sunamganj, Bangladesh",
  },
  {
    id: "post-17",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-02-16T14:45:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Sunrise-Boat.mp4",
    text: "সকাল বেলা নদীর চর থেকে তোলা কৃষিকাজের মনোরম দৃশ্য।",
    likes: 19,
    comments: 5,
    location: "Bhola, Bangladesh",
  },
  {
    id: "post-18",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-02-05T12:10:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60",
    text: "কৃষি উদ্যোক্তাদের জন্য মেন্টরশিপ প্রোগ্রামের আপডেট।",
    likes: 4,
    comments: 1,
    location: "Dinajpur, Bangladesh",
  },
  {
    id: "post-19",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2025-01-16T09:05:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Harvest-Time.mp4",
    text: "পোকা দমনে বায়োকন্ট্রোল ব্যবহারের রিয়েল-টাইম ফুটেজ।",
    likes: 22,
    comments: 6,
    location: "Noakhali, Bangladesh",
  },
  {
    id: "post-20",
    user: {
      name: "Krishok Ami",
      username: "krishokami1",
      avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-12-31T17:20:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1435773658541-98cedf12d3cd?auto=format&fit=crop&w=1200&q=60",
    text: "নতুন বছরের জন্য কৃষি পরিকল্পনা আর সেচ প্রকল্পের প্রস্তুতি।",
    likes: 15,
    comments: 4,
    location: "Bogura, Bangladesh",
  },
  {
    id: "post-21",
    user: {
      name: "Md. Shihab Ali",
      username: "mdshihabali",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-12-12T10:05:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1502741504051-5b849cc83741?auto=format&fit=crop&w=1200&q=60",
    text: "সমন্বিত পুষ্টি ব্যবস্থাপনা প্রয়োগের ফল জমিতে দেখা যাচ্ছে।",
    likes: 13,
    comments: 3,
    location: "Kushtia, Bangladesh",
  },
  {
    id: "post-22",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-11-28T15:30:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Autumn-Mountains.mp4",
    text: "শীতকালীন সবজির জন্য মাটির প্রস্তুতি কেমন হওয়া উচিত - ভিডিও টিউটোরিয়াল।",
    likes: 17,
    comments: 6,
    location: "Natore, Bangladesh",
  },
  {
    id: "post-23",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-11-15T07:15:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60",
    text: "কৃষকদের জন্য ফসল বীমার গুরুত্বপূর্ণ তথ্য নিয়ে সচেতনতা পোস্ট।",
    likes: 6,
    comments: 2,
    location: "Thakurgaon, Bangladesh",
  },
  {
    id: "post-24",
    user: {
      name: "Konika Mk",
      username: "santonakonikamk.SA",
      avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-10-30T18:12:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=1200&q=60",
    text: "পানির লেভেল মনিটরিং ডিভাইস কৃষকদের জীবনে কীভাবে পরিবর্তন আনছে।",
    likes: 21,
    comments: 7,
    location: "Feni, Bangladesh",
  },
  {
    id: "post-25",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-10-11T09:55:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Fly-Away.mp4",
    text: "ড্রোন সার্ভে করে জমির মানচিত্র তৈরির হাইলাইটস।",
    likes: 28,
    comments: 9,
    location: "Lakshmipur, Bangladesh",
  },
  {
    id: "post-26",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-09-28T08:32:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    text: "জলবায়ু পরিবর্তনের প্রভাবে কৃষিতে ঝুঁকি ও মোকাবিলা কৌশল নিয়ে আলোচনা।",
    likes: 7,
    comments: 3,
    location: "Tangail, Bangladesh",
  },
  {
    id: "post-27",
    user: {
      name: "Md. Shihab Ali",
      username: "mdshihabali",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-09-10T05:18:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1564518098554-1b04f3f60082?auto=format&fit=crop&w=1200&q=60",
    text: "চাষিদের নিয়ে কর্মশালায় মাটির গুণমান পরীক্ষা করা হচ্ছে।",
    likes: 5,
    comments: 1,
    location: "Kurigram, Bangladesh",
  },
  {
    id: "post-28",
    user: {
      name: "Rana Khan",
      username: "ranakhan123",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-08-24T11:40:00Z",
    mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Candle-Flame.mp4",
    text: "কৃষি উদ্যোক্তাদের জন্য রাতের অনলাইন সেশনের দৃশ্যপট।",
    likes: 9,
    comments: 2,
    location: "Panchagarh, Bangladesh",
  },
  {
    id: "post-29",
    user: {
      name: "Md. Mosarrof Hossain",
      username: "mosarrofhossain",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-08-05T07:07:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1494955464529-790512c65305?auto=format&fit=crop&w=1200&q=60",
    text: "মাটির উর্বরতা বৃদ্ধির জন্য সবুজ সার উৎপাদনের উপর নতুন প্রোজেক্ট।",
    likes: 12,
    comments: 3,
    location: "Barisal, Bangladesh",
  },
  {
    id: "post-30",
    user: {
      name: "Md. Momin Islam",
      username: "mominislamrajshahi",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=70",
    },
    createdAt: "2024-07-18T13:50:00Z",
    mediaUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60",
    text: "কৃষকদের জন্য কৃষি আইওটি ডিভাইস ব্যবহারের প্রশিক্ষণ শুরু হয়েছে।",
    likes: 8,
    comments: 2,
    location: "Bhola, Bangladesh",
  },
];

const isVideoFile = (url) => /\.(mp4|webm|ogg)$/i.test(url);

const timeFormatter = new Intl.DateTimeFormat("bn-BD", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function ManagePostsPage() {
  const [allPosts, setAllPosts] = useState(RAW_POSTS);
  const [items, setItems] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [removing, setRemoving] = useState({});
  const [confirmPost, setConfirmPost] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const loadTimerRef = useRef(null);
  const sentinelRef = useRef(null);

  const totalPosts = allPosts.length;
  const hasMore = loadedCount < totalPosts;

  const scheduleLoad = useCallback(
    (nextCount) => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
      setIsLoading(true);
      loadTimerRef.current = setTimeout(() => {
        setItems(allPosts.slice(0, nextCount));
        setLoadedCount(nextCount);
        setIsLoading(false);
      }, 360);
    },
    [allPosts]
  );

  const loadNextChunk = useCallback(() => {
    if (isLoading || !hasMore) return;
    const nextCount = Math.min(totalPosts, loadedCount + PAGE_SIZE);
    if (nextCount === loadedCount) return;
    scheduleLoad(nextCount);
  }, [hasMore, isLoading, loadedCount, scheduleLoad, totalPosts]);

  useEffect(() => {
    if (loadedCount === 0 && totalPosts > 0 && !isLoading) {
      scheduleLoad(Math.min(totalPosts, PAGE_SIZE));
    }
  }, [loadedCount, scheduleLoad, totalPosts, isLoading]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadNextChunk();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNextChunk]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  useEffect(
    () => () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    },
    []
  );

  const removePost = useCallback(
    (postId) => {
      setRemoving((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setAllPosts((prev) => {
          const next = prev.filter((post) => post.id !== postId);
          const nextCount =
            next.length === 0
              ? 0
              : Math.min(next.length, Math.max(PAGE_SIZE, Math.min(next.length, loadedCount)));
          setLoadedCount(nextCount);
          setItems(next.slice(0, nextCount));
          return next;
        });
        setRemoving((prev) => {
          const copy = { ...prev };
          delete copy[postId];
          return copy;
        });
        toast.success("Post deleted");
      }, 260);
    },
    [loadedCount]
  );

  const handleDeleteClick = useCallback((post) => {
    setConfirmPost(post);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmPost) {
      removePost(confirmPost.id);
      setConfirmPost(null);
    }
  }, [confirmPost, removePost]);

  const handleCancelDelete = useCallback(() => {
    setConfirmPost(null);
  }, []);

  const openLightbox = useCallback((post) => {
    setLightbox({
      url: post.mediaUrl,
      type: isVideoFile(post.mediaUrl) ? "video" : "image",
      user: post.user,
      createdAt: post.createdAt,
      text: post.text,
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const summary = useMemo(
    () => ({
      total: totalPosts,
      loaded: loadedCount,
      remaining: Math.max(totalPosts - loadedCount, 0),
    }),
    [loadedCount, totalPosts]
  );

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage All Post</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Manage Posts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body d-flex flex-wrap gap-3 align-items-center justify-content-between">
                  <div>
                    <h3 className="mb-1">Total Posts: {summary.total}</h3>
                    <p className="text-muted mb-0">
                      Showing {summary.loaded} posts &middot; {summary.remaining} remaining
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge badge-primary px-3 py-2">Loaded {summary.loaded}</span>
                    <span className="badge badge-secondary px-3 py-2">
                      Pending {summary.remaining}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="manage-posts-grid">
            {items.map((post) => {
              const video = isVideoFile(post.mediaUrl);
              return (
                <article
                  className={`manage-post-card ${removing[post.id] ? "is-removing" : ""}`}
                  key={post.id}
                >
                  <header className="manage-post-header">
                    <img
                      src={post.user.avatar}
                      alt={`${post.user.name} avatar`}
                      className="manage-post-avatar"
                    />
                    <div className="manage-post-meta">
                      <span className="manage-post-author">{post.user.name}</span>
                      <span className="manage-post-username">@{post.user.username}</span>
                    </div>
                    <button
                      type="button"
                      className="admin-icon-btn admin-trash-btn"
                      onClick={() => handleDeleteClick(post)}
                      aria-label={`Delete post from ${post.user.name}`}
                      title="Delete Post"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </header>

                  <div className="manage-post-body">
                    <p className="manage-post-text">{post.text}</p>
                    <div
                      className="manage-post-media"
                      role="button"
                      tabIndex={0}
                      onClick={() => openLightbox(post)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openLightbox(post);
                        }
                      }}
                      title="Open media"
                    >
                      {video ? (
                        <video
                          src={post.mediaUrl}
                          className="manage-post-video"
                          playsInline
                          preload="metadata"
                          muted
                        />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt={`Media from ${post.user.name}`}
                          className="manage-post-image"
                        />
                      )}
                    </div>
                  </div>

                  <footer className="manage-post-footer">
                    <div>
                      <span className="manage-post-time">{timeFormatter.format(new Date(post.createdAt))}</span>
                      {post.location && <span className="manage-post-location">{post.location}</span>}
                    </div>
                    <div className="manage-post-stats">
                      <span className="manage-post-stat" title={`${post.likes} likes`}>
                        <HeartOutlineIcon />
                        <span>{post.likes}</span>
                      </span>
                      <span className="manage-post-stat" title={`${post.comments} comments`}>
                        <CommentBubbleIcon />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>

          {!items.length && !isLoading && (
            <div className="card mt-3">
              <div className="card-body text-center text-muted py-5">No posts available.</div>
            </div>
          )}

          <div ref={sentinelRef} aria-hidden="true" />

          <div className="py-3 text-center text-muted">
            {isLoading && <span>Loading posts...</span>}
            {!isLoading && !hasMore && items.length > 0 && <span>You are all caught up.</span>}
          </div>
        </div>
      </section>

      {confirmPost && (
        <div className="admin-modal-backdrop" role="presentation">
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-delete-title"
            aria-describedby="post-delete-description"
          >
            <div className="admin-modal-header">
              <h5 id="post-delete-title" className="mb-0">
                Delete post
              </h5>
            </div>
            <div id="post-delete-description" className="admin-modal-body">
              <p className="mb-2">
                Remove the post from <strong>{confirmPost.user.name}</strong>?
              </p>
              <p className="text-muted mb-0">This will permanently delete the content and cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Lightbox
        open={Boolean(lightbox)}
        close={closeLightbox}
        slides={
          lightbox
            ? lightbox.type === "video"
              ? [
                  {
                    type: "video",
                    sources: [{ src: lightbox.url, type: "video/mp4" }],
                  },
                ]
              : [
                  {
                    src: lightbox.url,
                  },
                ]
            : []
        }
        plugins={lightbox?.type === "video" ? [Video] : []}
        render={{
          description: () =>
            lightbox ? (
              <div className="admin-lightbox-caption">
                <div className="admin-lightbox-meta">
                  <strong>{lightbox.user?.name}</strong>
                  <span>{timeFormatter.format(new Date(lightbox.createdAt))}</span>
                </div>
                {lightbox.text && <p>{lightbox.text}</p>}
              </div>
            ) : null,
        }}
        video={{ controls: true }}
      />
    </div>
  );
}
