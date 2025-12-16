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
  const { toggle } = useTheme();

  const notifications = useAppSelector(selectNotifications);
  const notificationsCount = useAppSelector(selectUnreadNotificationsCount);

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
              onClick={() => setShowCategory(!showCategory)}
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
            onFocus={() => setShowSuggestions(true)}
            id="search-input"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
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
            <Link to="/favorites" className={styles.favoritesLink}>
              <DecoratedButton variant={"heart"} />
            </Link>
          </div>

          <div
            className={styles.profile}
            data-trigger-dropdown="profile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                role="menu"
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
                    onClick={() => {
                      dispatch(logout());
                      setIsMenuOpen(false);
                    }}
                  >
                    Выйти из аккаунта
                    <LogOutSvg />
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
            <Link to="/login" className={styles.navLink}>
              <Button children={"Войти"} variant="secondary"></Button>
            </Link>

            <Link to="/registration/step1" className={styles.navLink}>
              <Button children={"Зарегистрироваться"}></Button>
            </Link>
          </div>
        </>
      )}
    </header>
  );
};
