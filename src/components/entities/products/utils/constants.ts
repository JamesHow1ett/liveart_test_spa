const productCreateFormDataFields = [
  'categoryId',
  'description',
  'name',
  'file',
  'hidden',
  'tags',
];

const productUpdateFormDataFields = [...productCreateFormDataFields, 'id', 'removeThumb'];

export const productFormDataFields = {
  create: productCreateFormDataFields,
  update: productUpdateFormDataFields,
};
