import { Project, ProjectCategory, getProjectsByCategory } from "./ProjectData";
import ProjectGrid from "./ProjectGrid";

interface Props {
  category: ProjectCategory;
  onOpenReadme: (project: Project) => void;
}

/** A titled group of projects (e.g. "AI & Machine Learning"). */
const CategorySection = ({ category, onOpenReadme }: Props) => {
  const items = getProjectsByCategory(category);
  if (items.length === 0) return null;

  return (
    <section className="work-category" aria-labelledby={`cat-${category.id}`}>
      {category.title.trim() !== "" && (
        <h3 className="work-category-title" id={`cat-${category.id}`}>
          {category.title} {category.accent && <span>{category.accent}</span>}
        </h3>
      )}
      <ProjectGrid projects={items} onOpenReadme={onOpenReadme} />
    </section>
  );
};

export default CategorySection;
