import { Button, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { mutate } from "swr";
import { Genre } from "../lib/models";
import useSWR from "swr";
import Loading from "./loading";

interface EditGenreModalInnerProps {
  genreId: number;
}

export default function EditGenreModal({ context, id, innerProps }: ContextModalProps<EditGenreModalInnerProps>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { genreId } = innerProps;
  const { data: genre, isLoading, error } = useSWR<Genre>(`/genres/${genreId}`);

  const genreEditForm = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหมวดหมู่"),
    },
  });

  // Set initial values when genre data is loaded
  useEffect(() => {
    if (genre) {
      genreEditForm.setValues({
        title: genre.title,
      });
    }
  }, [genre]);

  const handleSubmit = async (values: typeof genreEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/genres/${genreId}`, values);
      notifications.show({
        title: "แก้ไขหมวดหมู่สำเร็จ",
        message: "ข้อมูลหมวดหมู่ได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      // Refresh the genres data
      mutate("/genres");
      context.closeModal(id);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหมวดหมู่",
            message: "ไม่พบข้อมูลหมวดหมู่ที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (error.response?.status === 400) {
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        เกิดข้อผิดพลาดในการโหลดข้อมูลหมวดหมู่
      </div>
    );
  }

  return (
    <form onSubmit={genreEditForm.onSubmit(handleSubmit)} className="space-y-4">
      <TextInput
        label="ชื่อหมวดหมู่"
        placeholder="ระบุชื่อหมวดหมู่"
        {...genreEditForm.getInputProps("title")}
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
          บันทึกการแก้ไข
        </Button>
      </div>
    </form>
  );
}
