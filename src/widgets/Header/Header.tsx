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
import { Logo } from "@shared/ui/Logo/Logo";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { DecoratedButton } from "@shared/ui/DecoratedButton/DecoratedButton";
import { useTheme } from "@shared/hooks/useTheme";
import { useAppSelector } from "@app/store/hooks";
import { DropDown } from "@shared/ui/DropDown/DropDown";
import { DropDownListCategory } from "@shared/ui/DropDownListCategory/DropDownListCategory";
import NotificationPanel from "@features/notifications/ui/NotificationPanel/NotificationPanel";
import { selectUser } from "@/features/auth/model/slice";
import { useAppDispatch } from "@app/store/hooks";
import { logout } from "@/features/auth/model/slice";
import {
  selectNotifications,
  selectUnreadNotificationsCount,
  fetchNotifications,
  markAllNotificationsAsRead,
} from "@entities/notification/model/slice";

import type { TFilterState } from "@/features/filter-users/types";
import type { TSubcategory } from "@/entities/category/types";
import { Arrow } from "@/shared/ui/Arrow/Arrow";
import { LogOutSvg } from "./svg/LogoutSvg";
import defaultAvatar from "@shared/assets/images/icons/default-avatar.svg";
import {
  fetchCategories,
  selectCategoryData,
} from "@/entities/category/model/slice";

interface HeaderProps {
  onFiltersChange: (filters: TFilterState) => void;
  subcategories: TSubcategory[];
}

export const Header = ({ onFiltersChange, subcategories }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const user = useAppSelector(selectUser);
  const isAuth = Boolean(user);
  const dispatch = useAppDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<HTMLLIElement[]>([]);
  const profileMenuItemRefs = useRef<
    (HTMLAnchorElement | HTMLButtonElement | null)[]
  >([]);
  const { toggle } = useTheme();
  const { categories } = useAppSelector(selectCategoryData);

  const notifications = useAppSelector(selectNotifications);
  const notificationsCount = useAppSelector(selectUnreadNotificationsCount);

  const [categoriesIsLoaded, setCategoriesIsLoaded] = useState(false);

  const loadingCategory = () => {
    if (!categoriesIsLoaded) {
      if (categories.length === 0) {
        dispatch(fetchCategories());
      }
      setCategoriesIsLoaded(true);
    }
  };

  const handleCategoryDropDownToggle = () => {
    setShowCategory(!showCategory);
    loadingCategory();
  };

  useEffect(() => {
    if (isAuth && isNotificationsOpen) {
      dispatch(fetchNotifications());

      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isAuth, isNotificationsOpen, dispatch]);

  const handleMarkAllRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchValue(queryParam);
    } else {
      setSearchValue("");
    }
  }, [searchParams]);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const searchLower = searchValue.toLowerCase();
    return subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchLower),
    );
  }, [searchValue, subcategories]);

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

  const handleSuggestionKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number,
    name: string,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSuggestionClick(name);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const maxIndex = suggestionRefs.current.length - 1;
      if (maxIndex < 0) return;

      let nextIndex = index;
      if (event.key === "ArrowDown") {
        nextIndex = index === maxIndex ? 0 : index + 1;
      } else if (event.key === "ArrowUp") {
        nextIndex = index === 0 ? maxIndex : index - 1;
      }

      suggestionRefs.current[nextIndex]?.focus();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowSuggestions(false);
      (
        document.getElementById("search-input") as HTMLInputElement | null
      )?.focus();
    }
  };

  const handleProfileKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsMenuOpen((prev) => !prev);
    }

    if (event.key === "Escape" && isMenuOpen) {
      event.preventDefault();
      setIsMenuOpen(false);
    }
  };

  const handleProfileMenuItemKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
    index: number,
  ) => {
    const items = profileMenuItemRefs.current.filter(
      (item): item is HTMLAnchorElement | HTMLButtonElement => Boolean(item),
    );

    if (!items.length) {
      return;
    }

    const moveFocus = (nextIndex: number) => {
      const target = items[nextIndex];
      target?.focus();
    };

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        moveFocus((index + 1) % items.length);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        moveFocus((index - 1 + items.length) % items.length);
        break;
      }
      case "Home": {
        event.preventDefault();
        moveFocus(0);
        break;
      }
      case "End": {
        event.preventDefault();
        moveFocus(items.length - 1);
        break;
      }
      case "Escape": {
        event.preventDefault();
        setIsMenuOpen(false);
        break;
      }
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navigation} aria-label="Основная навигация">
        <Logo />

        <ul className={styles.navigationList}>
          <li>
            <Link to="/" className={styles.navigationLink}>
              О проекте
            </Link>
          </li>

          <li>
            <button
              className={clsx(
                styles.navigationDropDownLink,
                {
                  [styles.navigationDropDownLinkOpen]: !showCategory,
                  [styles.navigationDropDownLinkClose]: showCategory,
                },
                styles.navigationLink,
              )}
              data-trigger-dropdown="category"
              onClick={handleCategoryDropDownToggle}
              aria-expanded={showCategory}
              aria-haspopup="menu"
            >
              {/* Для работы компонента DropDown компоненту контроллеру нужно указать атрибут data-trigger-dropdown */}
              Все навыки
              <Arrow isOpen={showCategory} color="black" />
            </button>
            {showCategory && (
              <DropDown
                top="22px"
                left="-293px"
                triggerGroupe="category"
                onClose={() => setShowCategory(false)}
                isOpen={showCategory}
              >
                <DropDownListCategory
                  subcategories={subcategories}
                  onSubcategoryClick={(subcategoryId) => {
                    onFiltersChange({
                      purpose: "",
                      skills: [subcategoryId],
                      gender: "",
                      cityAll: [],
                    });

                    setShowCategory(false);

                    const subcategory = subcategories.find(
                      (sub) => sub.id === subcategoryId,
                    );
                    if (subcategory) {
                      navigate(`/?q=${encodeURIComponent(subcategory.name)}`);
                    }
                  }}
                />
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
            onFocus={loadingCategory}
            id="search-input"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
          />
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul
            className={styles.suggestions}
            role="listbox"
            aria-label="Подсказки поиска по навыкам"
          >
            {suggestions.map((sub, index) => (
              <li
                key={sub.id}
                className={styles.suggestionItem}
                role="option"
                tabIndex={index === 0 ? 0 : -1}
                ref={(element) => {
                  suggestionRefs.current[index] = element!;
                }}
                onClick={() => handleSuggestionClick(sub.name)}
                onKeyDown={(event) =>
                  handleSuggestionKeyDown(event, index, sub.name)
                }
              >
                {sub.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Компоненты доступные при авторизованном пользователе */}
      {isAuth ? (
        <div className={styles.ButtonsProfileWrapper}>
          <div className={styles.buttons}>
            <DecoratedButton variant={"moon"} onClick={() => toggle()} />

            <div data-trigger-dropdown="notifications">
              <DecoratedButton
                variant="bell"
                data-trigger-dropdown="notifications"
                notificationsCount={
                  notificationsCount > 0 ? notificationsCount : undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationsOpen((prev) => !prev);
                }}
              />
              {isNotificationsOpen && (
                <DropDown
                  triggerGroupe="notifications"
                  onClose={() => setIsNotificationsOpen(false)}
                  isOpen={isNotificationsOpen}
                >
                  <NotificationPanel
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                    aria-expanded={isNotificationsOpen}
                  />
                </DropDown>
              )}
            </div>
            <DecoratedButton
              variant={"heart"}
              onClick={() => navigate("/profile/favorites")}
            />
          </div>

          <div
            className={styles.profile}
            data-trigger-dropdown="profile"
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onKeyDown={handleProfileKeyDown}
          >
            <span className={styles.userName}>{user?.name}</span>
            <img
              className={styles.userImage}
              src={user?.avatarUrl}
              alt="Аватар пользователя"
              width={96}
              height={96}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultAvatar;
              }}
            />
            {isMenuOpen && (
              <DropDown
                top="40px"
                left="-260px"
                triggerGroupe="profile"
                onClose={() => {
                  setIsMenuOpen(false);
                }}
                isOpen={isMenuOpen}
              >
                <ul className={styles.profileMenuList} role="menu">
                  <li className={styles.profileMenuItem} role="none">
                    <Link
                      to={"/profile"}
                      role="menuitem"
                      ref={(element) => {
                        profileMenuItemRefs.current[0] = element;
                      }}
                      onKeyDown={(event) =>
                        handleProfileMenuItemKeyDown(event, 0)
                      }
                    >
                      Личный кабинет
                    </Link>
                  </li>
                  <li
                    className={clsx(
                      styles.profileMenuItem,
                      styles.profileMenuItemExit,
                    )}
                    role="none"
                  >
                    <button
                      type="button"
                      className={styles.profileMenuButton}
                      onClick={() => {
                        dispatch(logout());
                        setIsMenuOpen(false);
                      }}
                      ref={(element) => {
                        profileMenuItemRefs.current[1] = element;
                      }}
                      onKeyDown={(event) =>
                        handleProfileMenuItemKeyDown(event, 1)
                      }
                    >
                      Выйти из аккаунта
                      <LogOutSvg />
                    </button>
                  </li>
                </ul>
              </DropDown>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.decorateButtons}>
            <DecoratedButton variant={"moon"} onClick={() => toggle()} />
          </div>
          <div className={styles.authButtons}>
            <Button
              onClick={() => navigate("/login")}
              children={"Войти"}
              variant="secondary"
            ></Button>

            <Button
              onClick={() => navigate("/registration/step1")}
              children={"Зарегистрироваться"}
            ></Button>
          </div>
        </>
      )}
    </header>
  );
};
