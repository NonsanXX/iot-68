import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR, { mutate } from "swr";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconAlertTriangleFilled, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Genre } from "../lib/models";
import { notifications } from "@mantine/notifications";


export default function GenresPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: genres, error } = useSWR<Genre[]>("/genres");

  const handleDelete = async (genreId: number) => {
    try {
      setIsProcessing(true);
      await axios.delete(`/genres/${genreId}`);
      notifications.show({
        title: "ลบหมวดหมู่สำเร็จ",
        message: "ลบหมวดหมู่นี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      // Refresh the genres data
      mutate("/genres");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหมวดหมู่",
            message: "ไม่พบข้อมูลหมวดหมู่ที่ต้องการลบ",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">หมวดหมู่</h1>
          <h2>หมวดหมู่หนังสือทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการหมวดหมู่หนังสือ</h1>

            <Button
              leftSection={<IconPlus />}
              onClick={() => {
                modals.openContextModal({
                  modal: "addGenre",
                  title: "เพิ่มหมวดหมู่ใหม่",
                  innerProps: {},
                });
              }}
              size="xs"
              variant="primary"
              className="flex items-center space-x-2"
            >
              เพิ่มหมวดหมู่
            </Button>
          </div>

          {!genres && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {genres?.map((genre) => (
              <div className="border border-solid border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-neutral-300 bg-white rounded-lg" key={genre.id}>
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{genre.title}</h2>
                </div>

                <div className="flex justify-end gap-2 px-4 pb-2">
                  <Button
                    color="blue"
                    size="xs"
                    leftSection={<IconEdit />}
                    onClick={() => {
                      modals.openContextModal({
                        modal: "editGenre",
                        title: "แก้ไขหมวดหมู่",
                        innerProps: {
                          genreId: genre.id,
                        },
                      });
                    }}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    disabled={isProcessing}
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบหมวดหมู่นี้แล้ว จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete(genre.id);
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
