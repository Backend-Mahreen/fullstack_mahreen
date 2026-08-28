import { Check, ChevronDown, Search, UserRoundPlus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { tagsAdminService, type TagRecord } from "../../../../../services/newsroom/tagsAdminService";
import useNewsroomDatabase from "../../../../../hooks/useNewsroomDatabase";
import ArticleEditorSection from "./ArticleEditorSection";
import type { ArticleEditorData, ArticleEditorUpdate } from "./articleEditorTypes";

type ArticleClassificationProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const articleClassificationStyles = `
  .admin-article-category-box {
    min-height: 91px;
    padding: 12px;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 2px;
    background: var(--article-input);
  }
  .admin-article-category-box > div {
    display: flex;
    min-height: 26px;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }
  .admin-article-category-chip {
    display: inline-flex;
    min-height: 25px;
    padding: 5px 6px 5px 9px;
    align-items: center;
    gap: 5px;
    border: 1px solid rgba(239, 199, 63, 0.24);
    border-radius: 2px;
    color: #efd064;
    background: rgba(239, 199, 63, 0.12);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
  }
  .admin-article-category-chip button {
    display: grid;
    width: 15px;
    height: 15px;
    padding: 0;
    place-items: center;
    border: 0;
    color: inherit;
    background: transparent;
    cursor: pointer;
  }
  .admin-article-dropdown {
    position: relative;
    width: 100%;
  }
  .admin-article-dropdown__trigger {
    display: flex;
    width: 100%;
    min-height: 42px;
    padding: 0 11px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 2px;
    background: var(--article-input);
    color: #e8e5df;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    transition: border-color 160ms ease;
  }
  .admin-article-dropdown__trigger:hover { border-color: rgba(239, 199, 63, 0.4); }
  .admin-article-dropdown__trigger span { color: #89847a; }
  .admin-article-dropdown__panel {
    position: absolute;
    z-index: 50;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 220px;
    overflow: auto;
    border: 1px solid rgba(239, 199, 63, 0.22);
    border-radius: 4px;
    background: #1a1918;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }
  .admin-article-dropdown__search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .admin-article-dropdown__search svg { color: #89847a; flex-shrink: 0; }
  .admin-article-dropdown__search input {
    flex: 1;
    padding: 0;
    border: 0;
    background: transparent;
    color: #e8e5df;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    outline: none;
  }
  .admin-article-dropdown__search input::placeholder { color: #5c584f; }
  .admin-article-dropdown__item {
    display: flex;
    width: 100%;
    padding: 8px 10px;
    align-items: center;
    gap: 8px;
    border: 0;
    background: transparent;
    color: #d6d1c8;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    text-align: left;
    transition: background 120ms ease;
  }
  .admin-article-dropdown__item:hover { background: rgba(239, 199, 63, 0.06); }
  .admin-article-dropdown__item.is-selected { color: #efd064; }
  .admin-article-dropdown__item-check {
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    flex-shrink: 0;
  }
  .admin-article-dropdown__item.is-selected .admin-article-dropdown__item-check {
    border-color: rgba(239, 199, 63, 0.5);
    background: rgba(239, 199, 63, 0.15);
  }
  .admin-article-dropdown__empty {
    padding: 12px 10px;
    color: #89847a;
    font-size: 12px;
    text-align: center;
  }
`;

const ArticleClassification = ({ onChange, value }: ArticleClassificationProps) => {
  const { categories: dbCategories } = useNewsroomDatabase();
  const [availableTags, setAvailableTags] = useState<TagRecord[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsSearch, setTagsSearch] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesSearch, setCategoriesSearch] = useState("");

  useEffect(() => {
    void tagsAdminService.list({ limit: 100 }).then((result) => {
      setAvailableTags(result.items);
    }).catch(() => {});
  }, []);

  const filteredTags = useMemo(() => {
    const q = tagsSearch.trim().toLowerCase();
    return availableTags.filter((tag) =>
      !q || tag.title.toLowerCase().includes(q)
    );
  }, [availableTags, tagsSearch]);

  const filteredCategories = useMemo(() => {
    const q = categoriesSearch.trim().toLowerCase();
    return dbCategories.filter((cat) =>
      !q || cat.name.toLowerCase().includes(q)
    );
  }, [dbCategories, categoriesSearch]);

  const selectedTagTitles = useMemo(() => {
    const tagSet = new Set(value.tags.split(",").map((t) => t.trim()).filter(Boolean));
    return tagSet;
  }, [value.tags]);

  const toggleTag = useCallback((tagTitle: string) => {
    const current = value.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const next = current.includes(tagTitle)
      ? current.filter((t) => t !== tagTitle)
      : [...current, tagTitle];
    onChange({ tags: next.join(", ") });
  }, [value.tags, onChange]);

  const addCategory = (catName: string) => {
    if (!value.categories.includes(catName)) {
      onChange({ categories: [...value.categories, catName] });
    }
  };

  return (
    <ArticleEditorSection className="admin-article-classification" delay={160} title="Classification">
      <style data-component="admin-article-classification">{articleClassificationStyles}</style>
      <div className="admin-article-section__body admin-article-stack">
        <label className="admin-article-field">
          <span>Content Type</span>
          <select value={value.contentType} onChange={(event) => onChange({ contentType: event.target.value })}>
            <option>Article</option>
            <option>Press Release</option>
            <option>Insight</option>
            <option>Event Update</option>
          </select>
        </label>

        <div className="admin-article-field">
          <span>Category (Multi-select)</span>
          <div className="admin-article-category-box">
            <div>
              {value.categories.map((category) => (
                <span className="admin-article-category-chip" key={category}>
                  {category}
                  <button type="button" aria-label={`Remove ${category}`} onClick={() => onChange({ categories: value.categories.filter((item) => item !== category) })}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="admin-article-dropdown" data-dropdown="categories">
              <button
                type="button"
                className="admin-article-dropdown__trigger"
                onClick={() => { setCategoriesOpen((c) => !c); setCategoriesSearch(""); }}
              >
                <span>{value.categories.length === 0 ? "Pilih category..." : `${value.categories.length} dipilih`}</span>
                <ChevronDown size={14} />
              </button>
              {categoriesOpen ? (
                <div className="admin-article-dropdown__panel">
                  <div className="admin-article-dropdown__search">
                    <Search size={13} />
                    <input
                      placeholder="Cari category..."
                      value={categoriesSearch}
                      onChange={(e) => setCategoriesSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {filteredCategories.length === 0 ? (
                    <div className="admin-article-dropdown__empty">Tidak ada category ditemukan</div>
                  ) : (
                    filteredCategories.map((cat) => {
                      const isSelected = value.categories.includes(cat.name);
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          className={`admin-article-dropdown__item${isSelected ? " is-selected" : ""}`}
                          onClick={() => {
                            if (isSelected) {
                              onChange({ categories: value.categories.filter((c) => c !== cat.name) });
                            } else {
                              addCategory(cat.name);
                            }
                          }}
                        >
                          <span className="admin-article-dropdown__item-check">{isSelected ? <Check size={11} /> : null}</span>
                          {cat.name}
                        </button>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="admin-article-field">
          <span>Topics &amp; Tags</span>
          <div className="admin-article-category-box">
            <div>
              {Array.from(selectedTagTitles).map((tag) => (
                <span className="admin-article-category-chip" key={tag}>
                  #{tag}
                  <button type="button" aria-label={`Remove ${tag}`} onClick={() => toggleTag(tag)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="admin-article-dropdown" data-dropdown="tags">
              <button
                type="button"
                className="admin-article-dropdown__trigger"
                onClick={() => { setTagsOpen((c) => !c); setTagsSearch(""); }}
              >
                <span>{selectedTagTitles.size === 0 ? "Pilih tags..." : `${selectedTagTitles.size} dipilih`}</span>
                <ChevronDown size={14} />
              </button>
              {tagsOpen ? (
                <div className="admin-article-dropdown__panel">
                  <div className="admin-article-dropdown__search">
                    <Search size={13} />
                    <input
                      placeholder="Cari tags..."
                      value={tagsSearch}
                      onChange={(e) => setTagsSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {filteredTags.length === 0 ? (
                    <div className="admin-article-dropdown__empty">Tidak ada tag ditemukan</div>
                  ) : (
                    filteredTags.map((tag) => {
                      const isSelected = selectedTagTitles.has(tag.title);
                      return (
                        <button
                          type="button"
                          key={tag.id}
                          className={`admin-article-dropdown__item${isSelected ? " is-selected" : ""}`}
                          onClick={() => toggleTag(tag.title)}
                        >
                          <span className="admin-article-dropdown__item-check">{isSelected ? <Check size={11} /> : null}</span>
                          {tag.title}
                        </button>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <label className="admin-article-field">
          <span>Primary Author</span>
          <input
            type="text"
            value={value.primaryAuthor}
            onChange={(event) => onChange({ primaryAuthor: event.target.value })}
            placeholder="Ketik nama author..."
          />
        </label>

        <label className="admin-article-field admin-article-field--coauthor">
          <span>Co-Author</span>
          <span className="admin-article-input-icon admin-article-input-icon--left">
            <UserRoundPlus size={15} />
            <input
              type="text"
              value={value.coAuthor}
              onChange={(event) => onChange({ coAuthor: event.target.value })}
              placeholder="Ketik nama co-author..."
            />
          </span>
        </label>
      </div>
    </ArticleEditorSection>
  );
};

export default ArticleClassification;
