import ProductGrid from "../components/ProductGrid";
import CompanyHeader from "../components/CompanyHeader";
import SlideGallery from "../components/SlideGallery";

export default function CompanyName() {
  const products = [
    // --- কীটনাশক ---
    {
      id: 2,
      name: "একামাইট ১.৮ ই সি",
      material: "এবামেকটিন ১.৮%",
      category: "কীটনাশক",
    },
    {
      id: 7,
      name: "টিডো প্লাস",
      material: "ইমিডাক্লোপিড",
      category: "কীটনাশক",
    },
    {
      id: 9,
      name: "ইকোসালফান ১০ ইসি",
      material: "ইমিডাক্লোপিড",
      category: "কীটনাশক",
    },
    {
      id: 10,
      name: "লুমেকটিন 10 জি",
      material: "এবামেকটিন বেনজয়েট",
      category: "কীটনাশক",
    },
    { id: 11, name: "এডমায়ার", material: "ইমিডাক্লোপিড", category: "কীটনাশক" },
    {
      id: 27,
      name: "এসিমিক্স ৫৫ ই সি",
      material: "ক্লোরপাইরিফস ৫০ %+ সাইপারমেথ্রিন ৫ %",
      category: "কীটনাশক",
    },
    {
      id: 54,
      name: "টোপাজ 20 ইসি",
      material: "ইমিডাক্লোপিড",
      category: "কীটনাশক",
    },

    // --- ছত্রাকনাশক ---
    {
      id: 4,
      name: "এসিবিন ২৮ এস সি",
      material: "এজোক্সিস্ট্রবিন ২০% + সিপ্রকোনাজল ৮%",
      category: "ছত্রাকনাশক",
    },
    {
      id: 29,
      name: "কেমামিক্স ৭৫০ ডব্লিউ পি",
      material: "কার্বেন্ডাজিম ১২% + মেনকোজেম ৬৩%",
      category: "ছত্রাকনাশক",
    },
    { id: 44, name: "এন্ট্রাকল", material: "প্রপিনেব", category: "ছত্রাকনাশক" },

    // --- অনুখাদ্য ---
    { id: 6, name: "ম্যাজিক ড্রপ", material: "সিলিকন", category: "অনুখাদ্য" },
    {
      id: 26,
      name: "ইকোসালফান ১০ ইসি ইকোসালফান ১০ ইসি ইকোসালফান ১০ ইসি",
      material: "এবামেকটিন বেনজয়েট ইকোসালফান ১০ ইসি + ইকোসালফান ১০ ইসি",
      category: "অনুখাদ্য",
    },

    // --- আগাছানাশক ---
    { id: 25, name: "বাহাদুর", material: "এমক্লোর", category: "আগাছানাশক" },
    {
      id: 28,
      name: "product name is come",
      material: "product metarial",
      category: "আগাছানাশক",
    },
  ];

   const items = [
    { id: 2,  name: "একামাইট ১.৮ ই সি", img: "https://e7.pngegg.com/pngimages/184/503/png-clipart-insecticide-herbicide-pesticide-fungicide-others-acaricide-triticale.png" },
    { id: 4,  name: "এসিবিন ২৮ এস সি", img: "https://e7.pngegg.com/pngimages/684/889/png-clipart-hexaconazole-fungicide-agriculture-insecticide-herbicide-choota-bheem-agriculture-solvent-in-chemical-reactions-thumbnail.png" },
    { id: 6,  name: "ম্যাজিক ড্রপ",      img: "https://e7.pngegg.com/pngimages/451/698/png-clipart-herbicide-bayer-cropscience-fungicide-agriculture-product-kind-agriculture-agricultural-chemistry-thumbnail.png" },
    { id: 7,  name: "টিডো প্লাস",        img: "https://e7.pngegg.com/pngimages/89/588/png-clipart-herbicide-paraquat-pesticide-insecticide-weed-shaktiman-24dichlorophenoxyacetic-acid-weed-thumbnail.png" },
    { id: 9,  name: "ইকোসালফান ১০ ইসি",  img: "https://e7.pngegg.com/pngimages/513/231/png-clipart-fungicide-herbicide-agriculture-syngenta-bayer-product-kind-agriculture-product-kind-thumbnail.png" },
    { id: 10, name: "লুমেকটিন 10 জি",     img: "https://e7.pngegg.com/pngimages/522/91/png-clipart-insecticide-the-karate-kid-pesticide-syngenta-snake-sticking-material-pest-control-agriculture-thumbnail.png" },
    { id: 11, name: "এডমায়ার",           img: "https://e7.pngegg.com/pngimages/193/1002/png-clipart-insecticide-herbicide-bayer-crop-pflanzenschutzmittel-product-kind-crop-bayer-thumbnail.png" },
    { id: 25, name: "বাহাদুর",           img: "http://e7.pngegg.com/pngimages/732/99/png-clipart-insecticide-herbicide-biological-pest-control-weed-fungicide-buxus-pest-control-organic-farming-thumbnail.png" },
    { id: 26, name: "ইকোসালফান ১০ ইসি ইকোসালফান ১০ ইসি ইকোসালফান ১০ ইসি", img: "https://e7.pngegg.com/pngimages/205/355/png-clipart-herbicide-fungicide-bayer-product-cheminova-product-kind-organic-farming-azoxystrobin-thumbnail.png" },
    { id: 27, name: "এসিমিক্স ৫৫ ই সি",  img: "https://e7.pngegg.com/pngimages/147/644/png-clipart-liquid-phosphite-anion-fertilisers-fungicide-solution-ornamentals-agriculture-business-thumbnail.png" },
    { id: 28, name: "product name is come", img: "https://e7.pngegg.com/pngimages/928/509/png-clipart-insecticide-pesticide-aerosol-spray-wound-tenchu-pharmaceutical-drug-aerosol-spray-thumbnail.png" },
    { id: 29, name: "কেমামিক্স ৭৫০ ডব্লিউ পি", img: "https://e7.pngegg.com/pngimages/309/400/png-clipart-liquid-laboratory-flasks-chemical-substance-water-bottles-laboratory-equipment-glass-laboratory-thumbnail.png" },
    { id: 44, name: "এন্ট্রাকল",         img: "https://e7.pngegg.com/pngimages/99/595/png-clipart-herbicide-glyphosate-weed-sprayer-killer-price-pest-control-agriculture-thumbnail.png" },
    { id: 54, name: "টোপাজ 20 ইসি",      img: "https://e7.pngegg.com/pngimages/24/502/png-clipart-herbicide-insecticide-malathion-weed-control-others-pest-control-lawn-thumbnail.png" },
  ];

  // merge image URLs from `items` into `products` by id and add slug
  const imgMap = new Map(items.map(it => [String(it.id), it.img]));
  const merged = products.map(p => ({
    ...p,
    img: imgMap.get(String(p.id)),
    slug: p.name.toString().trim().toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0980-\u09FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }));

  return (<>
    <CompanyHeader />
    <ProductGrid items={merged} initialCount={20} step={10} />

     <SlideGallery items={items} />
  </>);
}
