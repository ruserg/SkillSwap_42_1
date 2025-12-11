import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { Calendar } from "@shared/ui/Calendar/Calendar";
import editIcon from "@images/icons/edit.svg?url";
import editPhotoIcon from "@images/icons/edit-photo.svg";
import styles from "./profilePage.module.scss";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectUser } from "@/features/auth/model/slice";
import { Selector } from "@/shared/ui/Selector/Selector";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { updateUserInState } from "@/entities/user/model/slice";
import { Loader } from "@/shared/ui/Loader/Loader";

export const ProfileForm = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  if (!user) return <Loader />;

  const [userData, setUserData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatarUrl ?? "",
  });

  useEffect(() => {
    setUserData((prevState) => ({
      ...prevState,
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatarUrl || "",
    })); // TODO: дата, пол, город, о себе - добавить
  }, [user]);

  const [editing, setEditing] = useState({
    email: false,
    name: false,
    about: false,
  });

  const [openSelectorId, setOpenSelectorId] = useState<string | null>(null);
  const selectorsRef = useRef<HTMLFormElement | null>(null);

  // Для закрытия выпадающего списка при открытии другого
  const handleToggle = (id: string) => {
    setOpenSelectorId((prev) => (prev === id ? null : id));
  };

  // Закрытие выпадающих списков при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openSelectorId &&
        selectorsRef.current &&
        !selectorsRef.current.contains(event.target as Node)
      ) {
        setOpenSelectorId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectorId]);

  // Изменение поля
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Сохранение изменений
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserInState(user.id, userData)); // TODO: правильно передать данные на сервер
  };

  // Активация функции редактирования поля
  const handleEditClick = (field: string) => {
    setEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Изменение аватара
  const handleAvatarChange = () => {};

  return (
    <section className={styles.content}>
      <div className={styles.profileBackground}>
        <div className={styles.grid}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Почта</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="text"
                  placeholder="Mariia@gmail.com"
                  aria-label="Email пользователя"
                  onChange={handleInputChange}
                  value={userData.email}
                  name={"email"}
                  readOnly={!editing.email}
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                  onClick={() => handleEditClick("email")}
                />
              </div>
              <button className={styles.changePassword}>Изменить пароль</button>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Имя</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="text"
                  placeholder="Мария"
                  aria-label="Имя пользователя"
                  value={userData.name}
                  onChange={handleInputChange}
                  name={"name"}
                  readOnly={!editing.name}
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                  onClick={() => handleEditClick("name")}
                />
              </div>
            </div>

            <div className={styles.birthGender}>
              <div className={styles.field}>
                <label className={styles.label}>Дата рождения</label>
                <div className={styles.inputBirth}>
                  <Calendar
                    value={new Date("1995-10-28")}
                    onChange={(date) => console.log(date)}
                  />
                </div>
              </div>

              {/* // TODO: поменять в выборе пола и города цвет текста */}
              <div className={styles.field}>
                <div
                  className={`${styles.genderWrapper} ${styles.commonWrapper}`}
                >
                  <Selector
                    id="gender"
                    isOpen={openSelectorId === "gender"}
                    onToggle={handleToggle}
                    selectionTitle={"Пол"}
                    selectionPlaceholder={"Женский"}
                    selectionOptions={["Не указан", "Мужской", "Женский"]}
                    selectorType={"radio"}
                  />
                </div>
              </div>
            </div>

            {/* // TODO: поменять selectionOptions на нужные опции */}
            <div className={styles.field}>
              <div className={`${styles.cityWrapper} ${styles.commonWrapper}`}>
                <Selector
                  id="city"
                  isOpen={openSelectorId === "city"}
                  onToggle={handleToggle}
                  selectionTitle={"Город"}
                  selectionPlaceholder={"Москва"}
                  selectionOptions={["Санкт-Петербург", "Самара", "Москва"]}
                  selectorType={"radio"}
                  enableSearch={true}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>О себе</label>
              <div className={styles.textareaWrapper}>
                <textarea
                  value="Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!"
                  aria-label="О себе"
                  readOnly={!editing.about}
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                  onClick={() => handleEditClick("about")}
                />
              </div>
            </div>

            <div className={styles.buttonSave}>
              <Button onClick={handleSubmit}>Сохранить</Button>
            </div>
          </div>

          {/* аватар меняется от useAppSelector(selectUser) - точно так же как и в шапке
          соответственно надо сделать так, чтобы его можно было менять - сейчас же фото из моков */}
          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrapper}>
              <img
                src={user?.avatarUrl}
                alt="avatar"
                className={styles.avatar}
              />
              <img
                src={editPhotoIcon}
                alt="Редактировать фото"
                className={styles.avatarEditIcon}
                onClick={handleAvatarChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
