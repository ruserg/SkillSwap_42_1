import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./header.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Logo } from "../../shared/ui/Logo";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { DecoratedButton } from "../../shared/ui/DecoratedButton";
import { useTheme } from "@shared/hooks/useTheme";
import { useAppSelector } from "@store/hooks";
import { selectReferenceData } from "@store/slices/referenceDataSlice";
import { DropDown } from "@/shared/ui/DropDown";
import { DropDownListCategory } from "@/shared/ui/DropDownListCategory";
import NotificationPanel from "../NotificationPanel/NotificationPanel";

export const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAuth] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const { subcategories } = useAppSelector(selectReferenceData);
  const { toggle } = useTheme();

  // Синхронизируем значение поиска с URL параметром
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchValue(queryParam);
    } else {
      // Очищаем строку поиска, если параметр q удален из URL
      setSearchValue("");
    }
  }, [searchParams]);

  // Фильтруем подкатегории по поисковому запросу
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const searchLower = searchValue.toLowerCase();
    return subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchLower),
    );
  }, [searchValue, subcategories]);

  // Закрываем подсказки при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSuggestions(false);
      // Переходим на главную страницу с параметром поиска
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSuggestionClick = (subcategoryName: string) => {
    setSearchValue(subcategoryName);
    setShowSuggestions(false);
    // Переходим на главную страницу с параметром поиска
    navigate(`/?q=${encodeURIComponent(subcategoryName)}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navigation} aria-label="main navigation">
        <Link to="/" className={styles.navLink}>
          <Logo />
        </Link>

        <ul className={styles.navigationLinkContainer}>
          <li>
            <Link to="/" className={styles.navigationLink}>
              О проекте
            </Link>
          </li>

          <li>
            <p
              className={clsx(
                styles.navigationDropDownLink,
                {
                  [styles.navigationDropDownLinkOpen]: !showCategory,
                  [styles.navigationDropDownLinkClose]: showCategory,
                },
                styles.navigationLink,
              )}
              data-trigger-dropdown="category"
              onClick={() => setShowCategory(!showCategory)}
            >
              {/* Для работы компонента DropDown компоненту контроллеру нужно указать атрибут data-trigger-dropdown */}
              Все навыки
            </p>
            {showCategory && (
              <DropDown
                top="22px"
                left="-293px"
                triggerGroupe="category"
                onClose={() => {
                  setShowCategory(false);
                }}
              >
                <DropDownListCategory />
              </DropDown>
            )}
          </li>
        </ul>
      </nav>

      <div className={styles.searchWrapper} ref={searchRef}>
        <form className={styles.search} onSubmit={handleSearchSubmit}>
          <Input
            type="search"
            placeholder="Искать навык"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((sub) => (
              <li
                key={sub.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(sub.name)}
              >
                {sub.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAuth ? (
        <>
          <div className={styles.decorateButtonsWrapper}>
            <DecoratedButton variant={"moon"} onClick={() => toggle()} />
            <div data-trigger-dropdown="notifications">
              <DecoratedButton
                variant="bell"
                data-trigger-dropdown="notifications"
                notificationsCount={notificationsCount}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationsOpen((prev) => !prev);
                }}
              />
              {isNotificationsOpen && (
                <DropDown
                  top="20px"
                  left="-137px"
                  triggerGroupe="notifications"
                  onClose={() => setIsNotificationsOpen(false)}
                >
                  <NotificationPanel />
                </DropDown>
              )}
            </div>
            <DecoratedButton variant={"heart"} />
          </div>

          <div
            className={styles.profile}
            data-trigger-dropdown="profile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.userName}>Мария</span>
            <img
              className={styles.userImage}
              src="https://i.pravatar.cc/150?img=17"
              alt="Аватар пользователя"
            />
          </div>
          {isMenuOpen && (
            <DropDown
              top="20px"
              left="1105px"
              triggerGroupe="profile"
              onClose={() => {
                setIsMenuOpen(false);
              }}
            >
              <ul className={styles.profileMenuList}>
                <li className={styles.profileMenuItem}>
                  <Link to={"/profile"}>Личный кабинет</Link>
                </li>
                <li
                  className={clsx(
                    styles.profileMenuItem,
                    styles.profileMenuItemExit,
                  )}
                  onClick={() => console.log("Вы вышли из аккаунта")}
                >
                  Выйти из аккаунта
                </li>
              </ul>
            </DropDown>
          )}
        </>
      ) : (
        <>
          <div className={styles.decorateButtonsWrapper}>
            <DecoratedButton variant={"moon"} onClick={() => toggle()} />
          </div>

          <div className={styles.authButtons}>
            <Link to="/login" className={styles.navLink}>
              <Button children={"Войти"} variant="secondary"></Button>
            </Link>

            <Link to="/registration/step1" className={styles.navLink}>
              <Button children={"Зарегистрироваться"}></Button>
            </Link>
          </div>
        </>
      )}
      {/* // ToDo Заменить на меню профиля когда оно будет готово */}

      {/* // ToDo Заменить на окно с уведомлениями когда оно будет готово */}
      {/* {isNotificationsOpen && (
        <DropDown
          top="20px"
          left="812px"
          onClose={() => setIsNotificationsOpen(false)}
        >
          <NotificationPanel />
        </DropDown>
      )} */}
      {/* // ToDo Заменить на окно с категориями когда оно будет готово */}
      {isCategoriesMenuOpen && (
        <div className={styles.categoriesMenu}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            delectus dolorem doloribus eligendi harum illum, itaque laboriosam
            maxime natus nostrum numquam perspiciatis, provident qui recusandae
            repudiandae sed tempore, veniam voluptatem?
          </p>
        </div>
      )}
    </header>
  );
};
