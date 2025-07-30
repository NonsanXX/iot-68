import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import meImage from "../assets/images/me.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[600px] w-full text-white bg-gradient-to-br from-orange-800 via-orange-700 to-orange-900 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl animate-fade-in">
            ยินดีต้อนรับสู่ <br />
            <span className="text-orange-300">IoT Library & Cafe</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-light opacity-90 drop-shadow-lg mb-8">
            ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
          </h2>
          <div className="flex justify-center space-x-8 text-lg opacity-80">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
              <span>เรียนรู้</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
              <span>ผ่อนคลาย</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
              <span>สร้างสรรค์</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-orange-300/30 rounded-full"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 border border-white/10 rotate-45"></div>
      </section>

      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">เกี่ยวกับเรา</h1>
            <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
          </div>

          {/* Founder Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ผู้ก่อตั้ง</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  <span className="text-orange-600 font-medium">IoT Library & Cafe</span> เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
                  และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                  <p className="text-gray-700 font-medium">
                    <span className="text-orange-700">ผศ.ดร. ปานวิทย์ ธุวะนุติ</span><br />
                    <span className="text-sm text-gray-600">อาจารย์ในวิชา Internet of Things</span>
                  </p>
                </div>
                <p className="text-gray-500 text-sm italic">
                  โค้ดชุดนี้เป็นโค้ดตัวอย่างในหัวข้อ Hono และ React ในวิชานี้
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={ajPanwitImage} 
                    alt="Panwit Tuwanut" 
                    className="w-64 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300" 
                  />

                </div>
              </div>
            </div>
          </div>
          
          {/* Current Manager Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center lg:order-1">
                <div className="relative">
                  <img 
                    src={meImage} 
                    alt="Phuriphat Arunpaisan" 
                    className="w-64 h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2 lg:order-2 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ผู้ดูแลปัจจุบัน</h2>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                  <p className="text-gray-700 font-medium">
                    <span className="text-blue-700">นายภูริภัทร อรุณไพศาล</span><br />
                    <span className="text-sm text-gray-600">รหัสประจำตัว: 66070305</span>
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  ปัจจุบันคาเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของผมครับ 
                  ซึ่งมุ่งมั่นที่จะสร้างพื้นที่แห่งการเรียนรู้และความสุขสำหรับผู้ที่หลงใหลในเทคโนโลยี IoT
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>กาแฟคุณภาพดี</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>ขนมหวานแสนอร่อย</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>บรรยากาศเอื้อต่อการศึกษา</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>ทรัพยากรการเรียนรู้ทันสมัย</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm italic mt-4">
                  เพื่อให้ทุกคนได้สัมผัสกับความก้าวหน้าของเทคโนโลยีในยุคดิจิทัลอย่างเต็มที่
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-orange-800/40"></div>
        <img src={coffeeImage} alt="Coffee" className="w-full h-96 object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">เยี่ยมชมเราได้ทุกวัน</h2>
            <p className="text-xl opacity-90 drop-shadow-md">สัมผัสประสบการณ์การเรียนรู้ใหม่ๆ ไปกับเรา</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
