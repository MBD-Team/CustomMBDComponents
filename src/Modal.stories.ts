import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';
import { screen, userEvent } from '@storybook/testing-library';

import Modal from './Modal.vue';

export default {
  title: 'Modal',
  component: Modal,
};

const ModalFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Modal> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Modal },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 We create a “template” of how args map to rendering
export const ExampleModal = ModalFromTemplate(
  args => String.raw`
    <Modal title="ModalTitle" affirmText="affirm" affirmClass="btn btn-success" affirmAltText="affirm alternative" affirmAltClass="btn btn-info" 
        negativeText="negative" negativeClass="btn btn-danger" ${args}>
      <p>test modal body contet</p>
      <img src="https://i.picsum.photos/id/629/200/300.jpg?hmac=YTSnJIQbXgJTOWUeXAqVeQYHZDodXXFFJxd5RTKs7yU">
      <p>test modal body contet</p>
      <template #button>
          <div class="d-flex justify-content-center"><img role="button" src="https://i.picsum.photos/id/722/200/300.jpg?hmac=MDrZtULoytyxS357HVHCqzJRUv_BsxU0MEgszPVuMyY"></div>
      </template>
      </Modal>
      <p class="text-center text-secondary mt-4">click on the image to open the modal</p>
    `
);

export const FormModal = ModalFromTemplate(
  args => String.raw`
    <Modal title="FormModal" affirmText="submit form" affirmClass="btn btn-primary"  negativeText="cancel" negativeClass="btn btn-secondary" ${args}>
    <form>
        <input type="text" placeholder="name" class="form-control mb-3">
        <input type="text" placeholder="email" class="form-control mb-3">
        <textarea  placeholder="message" class="form-control"></textarea>
    </form>
    <template #button>
        <button class="btn btn-primary">contact us</button>
    </template>
    </Modal>
  `
);

export const BasicModal = ModalFromTemplate(
  args => String.raw`
  <Modal>
    <form><input data-testid="input" class="form-control" type="text" placeholder="text"></form>
    <template #button><button role="button" class="btn btn-primary">Open Modal Button</button></template>
  </Modal>`
);

BasicModal.play = async () => {
  const button = screen.getByRole('button');
  await userEvent.click(button);

  const input = screen.getByTestId('input');
  await userEvent.type(input, 'testtesttesttesttest', {
    delay: 800,
  });
};
