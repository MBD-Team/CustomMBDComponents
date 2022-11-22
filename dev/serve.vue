<template>
  <div id="app" style="height: 100vh" class="d-flex align-items-center flex-column">
    <div>
      <Accordion :items="items" itemClass=" nav-pills" :startShow="2">
        <template #dashboard>
          <div class="p-3">
            <i class="fas fa-home fa-lg me-2"></i>
            Dashboard
          </div>
        </template>
        <template #myClub>
          <div class="p-3">
            <i class="fas me-2">
              <svg
                width="1.5em"
                height="1.5em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 20 20"
                class="iconify"
                data-icon="entypo:sports-club"
                data-inline="true"
                style="vertical-align: -0.125em; transform: rotate(360deg)"
              >
                <path
                  d="M6 13.5l4 2.5l4-2.5V5H6v8.5zM4.5 10a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm13-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4zM4.485 6.199A6.71 6.71 0 0 1 10 3.3a6.715 6.715 0 0 1 5.456 2.823a1.4 1.4 0 0 0 2.281-1.624A9.518 9.518 0 0 0 10 .5a9.506 9.506 0 0 0-7.817 4.107a1.402 1.402 0 0 0 .355 1.948a1.401 1.401 0 0 0 1.947-.356zm10.971 7.678A6.713 6.713 0 0 1 10 16.7a6.71 6.71 0 0 1-5.515-2.899a1.4 1.4 0 0 0-2.302 1.592A9.506 9.506 0 0 0 10 19.5a9.518 9.518 0 0 0 7.737-3.999a1.401 1.401 0 0 0-2.281-1.624z"
                  fill="currentColor"
                ></path>
              </svg>
            </i>
            Mein Club
          </div>
        </template>
        <template #ksv><div class="p-2 ps-4 active nav-link text-white rounded-0">Sportstätten Meldungen</div></template>
        <template #clubAdministration>
          <div class="p-2 ps-4">Allgemeine Informationen</div>
          <div class="p-2 ps-4 active nav-link text-white rounded-0">Weitere Einstellungen</div>
          <div class="p-2 ps-4">Sportarten</div>
          <div class="p-2 ps-4">Sportstätten</div>
        </template>
        <template #clubAbrechnungen>
          <div class="p-2 ps-4">Beitragsarten</div>
          <div class="p-2 ps-4">Beitragsabrechnungen</div>
        </template>
        <template #mitgliederVerwaltung>
          <div class="p-2 ps-4">MitgliederListe</div>
          <div class="p-2 ps-4">Teamverwaltung</div>
        </template>
        <template #benachrichtigungen>
          <div class="p-3">
            <i class="fas fa-envelope fa-lg me-2"></i>
            Benachrichtigungen
          </div>
        </template>
        <template #veranstaltungen>
          <div class="p-2 ps-4">Veranstaltung erstellen</div>
          <div class="p-2 ps-4">Kalendar</div>
          <div class="p-2 ps-4">Veranstaltung finden</div>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/components/Modal.vue';
import Button from '../src/components/Button.vue';
import Spinner from '../src/components/Spinner.vue';
import Calendar from '../src/components/Calendar/Calendar.vue';
import Carousel from '../src/components/Carousel.vue';
import CheckboxGroup from '../src/components/SexyInputs/CheckboxGroup.vue';
import Checkbox from '../src/components/SexyInputs/Checkbox.vue';
import Time from '../src/components/SexyInputs/Time.vue';
import Date from '../src/components/SexyInputs/Date.vue';
import RadioGroup from '../src/components/SexyInputs/RadioGroup.vue';
import ButtonGroup from '../src/components/SexyInputs/ButtonGroup.vue';
import Tooltip from '../src/components/Tooltip.vue';
import Search from '../src/components/SexyInputs/Search.vue';
import Textarea from '../src/components/SexyInputs/Textarea.vue';
import MultiSelect from '../src/components/SexyInputs/MultiSelect.vue';
import { handleClick } from '../src/utils/clickHandler';
import Wizard from '../src/components/Wizard.vue';
import Accordion from '../src/components/Accordion.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { title: 'Dashboard', hash: 'dashboard', noAccordion: true },
  { title: 'Mein Club', hash: 'myClub', noAccordion: true },
  { title: 'KSV', titleIcon: 'fas fa-hotel fa-lg', hash: 'ksv' },
  { title: 'Clubadministration', titleIcon: 'fas fa-info-circle fa-lg', hash: 'clubAdministration' },
  { title: 'Clubabrechnungen', titleIcon: 'fas fa-file-alt fa-lg', hash: 'clubAbrechnungen' },
  { title: 'Mitgliederverwaltung', titleIcon: 'fas fa-users fa-lg', hash: 'mitgliederVerwaltung' },
  { title: 'Benachrichtigungen', hash: 'benachrichtigungen', noAccordion: true },
  { title: 'Veranstaltungen', titleIcon: 'fas fa-calendar-alt fa-lg', hash: 'veranstaltungen' },
]);
const inhalt = ref('');
const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
const array = ref([
  { name: 'test', id: 0 },
  { name: 'test', id: 1 },
]);
const selectedArray = ref([{ name: 'test', id: 0 }]);
function test(e: any) {
  console.log(e);
}
</script>
<style lang="scss"></style>
