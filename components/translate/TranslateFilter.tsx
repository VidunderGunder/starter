import { Modal } from "@mantine/core";
import Filter, { FilterColumn, FilterTitle } from "components/general/Filter";
import ModalButton from "components/general/ModalButton";
import { languages, platforms } from "data/data";
import { removeSymbols } from "functions/text";
import { ComponentPropsWithoutRef, useState } from "react";
import { FcFilledFilter } from "react-icons/fc";
import { titleCase } from "functions/text";

const translateColumns: FilterColumn[] = [
  ...Object.keys(languages).map((language) => ({
    id: removeSymbols(language),
    name: titleCase(languages[language]),
    category: "language",
  })),
  ...platforms.map((platform) => ({
    id: platform.toLowerCase(),
    name: titleCase(platform),
    category: "platform",
  })),
];

export default function TranslateFilter({
  columns = translateColumns,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Filter>, "pluralizeCategories">) {
  return <Filter columns={columns} pluralizeCategories {...props} />;
}

export function TranslateFilterButton({
  columns = translateColumns,
  selectedColumns = [],
  onApply,
}: {
  columns?: FilterColumn[];
  selectedColumns?: FilterColumn[];
  onApply?: (selectedColumns: FilterColumn[]) => void;
}) {
  const [opened, setOpened] = useState(false);
  function closeModal() {
    setOpened(false);
  }
  function openModal() {
    setOpened(true);
  }
  function apply(selectedColumns: FilterColumn[]) {
    onApply?.(selectedColumns);
    closeModal();
  }

  return (
    <ModalButton
      color="dark"
      leftIcon={<FcFilledFilter />}
      onClick={openModal}
      modal={
        <Modal
          centered
          opened={opened}
          onClose={closeModal}
          title={<FilterTitle />}
        >
          <TranslateFilter
            selectedColumns={selectedColumns}
            columns={columns}
            onApply={apply}
          />
        </Modal>
      }
    >
      Filter
    </ModalButton>
  );
}
