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
import { useAppSelector } from "@store/hooks";
import { selectReferenceData } from "@store/slices/referenceDataSlice";

export const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const { subcategories } = useAppSelector(selectReferenceData);

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

          {/* // TODO: Заменить navigationDropDownLink на компонент DropdownMenu, когда он будет готов */}
          <li>
            <Link
              to="/"
              className={clsx(
                styles.navigationDropDownLink,
                styles.navigationLink,
              )}
            >
              Все навыки
            </Link>
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

      <DecoratedButton variant={"moon"} />

      <div className={styles.authButtons}>
        <Link to="/login" className={styles.navLink}>
          <Button children={"Войти"} variant="secondary"></Button>
        </Link>

        <Link to="/registration/step1" className={styles.navLink}>
          <Button children={"Зарегистрироваться"}></Button>
        </Link>
      </div>
    </header>
  );
};
