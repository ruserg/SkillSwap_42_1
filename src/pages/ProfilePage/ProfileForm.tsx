import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { Calendar } from "@shared/ui/Calendar/Calendar";
import editPhotoIcon from "@images/icons/edit-photo.svg";
import styles from "./profilePage.module.scss";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  changePassword,
  selectIsLoading,
  selectUser,
  updateCurrentUser,
} from "@/features/auth/model/slice";
import { Selector } from "@/shared/ui/Selector/Selector";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { Loader } from "@/shared/ui/Loader/Loader";
import { selectCities } from "@/entities/city/model/slice";
import type { UpdateUserRequest } from "@/shared/lib/types/api";
import { ModalUI } from "@/shared/ui/Modal/Modal";
import { Edit } from "@/shared/ui/DecoratedButton/svg/IconSvg";

export const ProfileForm = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { cities } = useAppSelector(selectCities);
  const isRequestLoading = useAppSelector(selectIsLoading);

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const cityNameToId = new Map(cities.map((city) => [city.name, city.id]));

  if (!user) return <Loader />;

  const [userData, setUserData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth)
      : (null as Date | null),
    gender: user?.gender ?? ("M" as "M" | "F"),
    cityId: user?.cityId ?? 0,
    about: user?.about ?? "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name ?? "",
        email: user.email ?? "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
        gender: user.gender ?? "M",
        cityId: user.cityId ?? 0,
        about: user.about ?? "",
      });
      // Сбрасываем preview только если нет выбранного файла
      // Это позволяет показывать preview выбранного файла до сохранения
      if (!avatarFile) {
        setAvatarPreview(null);
      }
    }
  }, [user, avatarFile]);

  const [editing, setEditing] = useState({
    email: false,
    name: false,
    about: false,
  });

  const [openSelectorId, setOpenSelectorId] = useState<string | null>(null);
  const selectorsRef = useRef<HTMLFormElement | null>(null);

  const handleToggle = (id: string) => {
    setOpenSelectorId((prev) => (prev === id ? null : id));
  };

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setUserData((prevState) => ({
      ...prevState,
      dateOfBirth: date,
    }));
  };

  const handleGenderSelect = (gender: "M" | "F" | "") => {
    if (gender === "") return;
    setUserData((prevState) => ({
      ...prevState,
      gender: gender as "M" | "F",
    }));
  };

  const handleCitySelect = (cityId: number) => {
    setUserData((prevState) => ({
      ...prevState,
      cityId,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const hasAvatar = avatarFile !== null;
      const updateData: UpdateUserRequest | FormData = hasAvatar
        ? new FormData()
        : ({} as UpdateUserRequest);

      if (hasAvatar) {
        const formData = updateData as FormData;
        if (userData.email) formData.append("email", userData.email);
        if (userData.name) formData.append("name", userData.name);
        if (userData.dateOfBirth) {
          formData.append(
            "dateOfBirth",
            userData.dateOfBirth.toISOString().split("T")[0],
          );
        }
        if (userData.gender) formData.append("gender", userData.gender);
        if (userData.cityId)
          formData.append("cityId", userData.cityId.toString());
        if (userData.about !== undefined)
          formData.append("about", userData.about);
        formData.append("avatar", avatarFile);
      } else {
        const jsonData = updateData as UpdateUserRequest;
        if (userData.email) jsonData.email = userData.email;
        if (userData.name) jsonData.name = userData.name;
        if (userData.dateOfBirth) {
          jsonData.dateOfBirth = userData.dateOfBirth
            .toISOString()
            .split("T")[0];
        }
        if (userData.gender) jsonData.gender = userData.gender;
        if (userData.cityId) jsonData.cityId = userData.cityId;
        if (userData.about !== undefined) jsonData.about = userData.about;
      }

      await dispatch(updateCurrentUser(updateData)).unwrap();
      setAvatarFile(null);
      setAvatarPreview(null);
      setEditing({
        email: false,
        name: false,
        about: false,
      });
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      alert("Ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (field: string) => {
    setEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handlePasswordChange = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      await dispatch(
        changePassword({ newPassword: passwordData.newPassword }),
      ).unwrap();
      alert("Пароль успешно изменен!");
      setIsPasswordModalOpen(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
      alert("Ошибка при изменении пароля");
    }
  };

  return (
    <>
      <section className={styles.content}>
        {isRequestLoading && <Loader />}
        <div className={styles.profileBackground}>
          <div className={styles.grid}>
            <div className={styles.fields}>
              <form ref={selectorsRef} onSubmit={handleSubmit}>
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
                      style={
                        editing.email
                          ? { backgroundColor: "var(--color-editing-color)" }
                          : undefined
                      }
                    />
                    <div
                      className={styles.inputChildrenIcon}
                      onClick={() => handleEditClick("email")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleEditClick("email");
                        }
                      }}
                    >
                      <Edit />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.changePassword}
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Изменить пароль
                  </button>
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
                      style={
                        editing.name
                          ? { backgroundColor: "var(--color-editing-color)" }
                          : undefined
                      }
                    />
                    <div
                      className={styles.inputChildrenIcon}
                      onClick={() => handleEditClick("name")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleEditClick("name");
                        }
                      }}
                    >
                      <Edit />
                    </div>
                  </div>
                </div>

                <div className={styles.birthGender}>
                  <div className={styles.field}>
                    <label className={styles.label}>Дата рождения</label>
                    <div className={styles.inputBirth}>
                      <Calendar
                        value={userData.dateOfBirth}
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>

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
                        value={
                          userData.gender === "M"
                            ? "Мужской"
                            : userData.gender === "F"
                              ? "Женский"
                              : ""
                        }
                        onChange={(value) =>
                          handleGenderSelect(value === "Мужской" ? "M" : "F")
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <div
                    className={`${styles.cityWrapper} ${styles.commonWrapper}`}
                  >
                    <Selector
                      id="city"
                      isOpen={openSelectorId === "city"}
                      onToggle={handleToggle}
                      selectionTitle={"Город"}
                      selectionPlaceholder={"Москва"}
                      selectionOptions={cities.map((city) => city.name)}
                      selectorType={"radio"}
                      enableSearch={true}
                      value={
                        cities.find((city) => city.id === userData.cityId)
                          ?.name || ""
                      }
                      onChange={(value) => {
                        if (typeof value === "string") {
                          const cityId = cityNameToId.get(value);
                          if (cityId !== undefined) {
                            handleCitySelect(cityId);
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>О себе</label>
                  <div className={styles.textareaWrapper}>
                    <textarea
                      value={userData.about}
                      onChange={handleInputChange}
                      name="about"
                      aria-label="О себе"
                      readOnly={!editing.about}
                      style={
                        editing.about
                          ? { backgroundColor: "var(--color-editing-color)" }
                          : undefined
                      }
                    />
                    <div
                      className={styles.inputChildrenIcon}
                      onClick={() => handleEditClick("about")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleEditClick("about");
                        }
                      }}
                    >
                      <Edit />
                    </div>
                  </div>
                </div>

                <div className={styles.buttonSave}>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Сохранение..." : "Сохранить"}
                  </Button>{" "}
                </div>
              </form>
            </div>

            <div className={styles.avatarBlock}>
              <div className={styles.avatarWrapper}>
                <img
                  src={avatarPreview || user?.avatarUrl || ""}
                  alt="avatar"
                  className={styles.avatar}
                />
                <label
                  htmlFor="avatar-input"
                  className={styles.avatarEditLabel}
                >
                  <img
                    src={editPhotoIcon}
                    alt="Редактировать фото"
                    className={styles.avatarEditIcon}
                  />
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isPasswordModalOpen && (
        <ModalUI
          onClose={() => setIsPasswordModalOpen(false)}
          titleId="password-modal-title"
          descriptionId="password-modal-description"
        >
          <div className={styles.passwordModal}>
            {isRequestLoading && <Loader />}
            <h2 id="password-modal-title">Изменить пароль</h2>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.field}>
                <label className={styles.label}>Новый пароль</label>
                <Input
                  type="password"
                  placeholder="Введите новый пароль"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  minLength={6}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Подтвердите пароль</label>
                <Input
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  minLength={6}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <Button type="submit">Изменить пароль</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        </ModalUI>
      )}
    </>
  );
};
