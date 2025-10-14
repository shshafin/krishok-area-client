import ProductBackHeader from "./ProductBackHeader";
import SlideGallery from "./SlideGallery";

export default function ProductDetails({
  image = "https://placehold.co/300x400?text=Product+Image",
  category = "কীটনাশক",
  name = "একামাইট ১.৮ ই সি",
  material = "এবামেকটিন ১.৮%",
  benefit = "চা এবং সবজির মাকড় দমনে নির্ভরযোগ্য সমাধান।",
  longDescription = `স্পর্শ ক্রিয়া সম্পন্ন কীটনাশক বলে সরাসরি শরীরের সংস্পর্শে আসা মাত্র পোকা মারা যায়।
পাকস্থলীয় ক্রিয়া সম্পন্ন কীটনাশক তাই স্প্রে করা পাতা, ডগা ইত্যাদি থেকে রস খাবার সাথে সাথে পোকা মারা যায়।
ইহা যেহেতু একটি ট্রান্সলেমিনার গুণসম্পন্ন মাকড়নাশক তাই পাতার উপর`,
  tableData = [
    {
      crop: "পাট, শসা, পটল, তরমুজ",
      pest: "লাল মাকড়",
      dose: "প্রতি ১০ লিটার পানিতে ৫ শতাংশ জমির জন্য ২০ মি লি / একরে ৪০০ মি লি",
      method:
        "ফসলের বাড়ন্ত সময়ে জমিতে ক্ষুদ্রপোকা দেখা গেলে ১৫ দিন অন্তর অন্তর স্প্রে করতে হবে ।",
    },
  ],
  
}) {

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

  return (
    <div style={{ marginTop: "5rem" }}>
      <div className="product-details-boxsize">
        <div className="product-details-image">
          <img
            className=""
            src={image}
            alt="product image"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x400?text=No+Image";
            }}
          />
        </div>

        <div className="product-details-text">
          <p title="product category" className="newproduct-ctg">
            {category}
          </p>
          <h2>{name}</h2>
          <p title="product material name" className="promatname">
            {material}
          </p>

          <h4>ব্যবহারের সুবিধা -:</h4>
          <p title="product title">{benefit}</p>
        </div>
      </div>

      <div className="product-details-imgtitle">
        <h2 style={{ whiteSpace: "pre-line" }}>{longDescription}</h2>
      </div>

      <div className="product-details-tablesize">
        <div className="product-details-tabletitle">
          <h2>প্রয়োগ ক্ষেত্র ও মাত্রা</h2>

          <table className="product-details-table">
            <thead>
              <tr>
                <th scope="col">ফসল</th>
                <th scope="col">বালাই</th>
                <th scope="col">মাত্রা</th>
                <th scope="col">ব্যবহারবিধি</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, i) => (
                <tr key={i}>
                  <td>
                    <p>{item.crop}</p>
                  </td>
                  <td>
                    <p>{item.pest}</p>
                  </td>
                  <td>
                    <p>{item.dose}</p>
                  </td>
                  <td>
                    <p>{item.method}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductBackHeader
        companyName="এ সি আই ক্রপ কেয়ার 101"
        companySlug="aci-crop-care-101"
      />

    <SlideGallery items={items} />
    </div>
  );
}
