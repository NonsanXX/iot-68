import { Button, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { mutate } from "swr";

export default function AddGenreModal({ context, id }: ContextModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const genreCreateForm = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหมวดหมู่"),
    },
  });

  const handleSubmit = async (values: typeof genreCreateForm.values) => {
    try {
      setIsProcessing(true);
      await axios.post("/genres", values);
      notifications.show({
        title: "เพิ่มหมวดหมู่สำเร็จ",
        message: "หมวดหมู่ใหม่ได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      // Refresh the genres data
      mutate("/genres");
      context.closeModal(id);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
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
    <form onSubmit={genreCreateForm.onSubmit(handleSubmit)} className="space-y-4">
      <TextInput
        label="ชื่อหมวดหมู่"
        placeholder="ระบุชื่อหมวดหมู่"
        {...genreCreateForm.getInputProps("title")}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="default" 
          onClick={() => context.closeModal(id)}
          disabled={isProcessing}
        >
          ยกเลิก
        </Button>
        <Button type="submit" loading={isProcessing}>
          บันทึก
        </Button>
      </div>
    </form>
  );
}
