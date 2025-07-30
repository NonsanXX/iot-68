import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import meImage from "../assets/images/me.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
            IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
            ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things
            โค้ดชุดนี้เป็นโค้ดตัวอย่างในหัวข้อ Hono และ React ในวิชานี้
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div>
            <img src={meImage} alt="Your Photo" className="h-full w-full object-cover" />
          </div>
          
          <p className="text-left col-span-2">
            ปัจจุบันคาเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ นายภูริภัทร อรุณไพศาล รหัสประจำตัว 66070305
            ซึ่งมุ่งมั่นที่จะสร้างพื้นที่แห่งการเรียนรู้และความสุขสำหรับผู้ที่หลงใหลในเทคโนโลยี IoT 
            ที่นี่เราให้บริการกาแฟคุณภาพดี ขนมหวานแสนอร่อย และบรรยากาศที่เอื้อต่อการศึกษาค้นคว้า
            พร้อมด้วยหนังสือและทรัพยากรการเรียนรู้ที่ทันสมัย เพื่อให้ทุกคนได้สัมผัสกับความก้าวหน้า
            ของเทคโนโลยีในยุคดิจิทัลอย่างเต็มที่
          </p>
        </div>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
