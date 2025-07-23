import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu";

@Component({
  selector: 'app-glossary',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './glossary.html',
  styleUrls: ['./glossary.css']
})
export class GlossaryComponent {
  glossary = [
    { term: 'Biogas', definition: 'Biogas is a form of renewable energy. Biogas is produced through the anaerobic digestion or fermentation of organic feedstocks including biomass, sewage and agricultural and municipal wastes. The biogas can then be burnt as a renewable fuel.', expanded: false },
    { term: 'Biomass', definition: 'Biomass fuel is a form of renewable energy generated from burning organic material such as wood, poultry litter, and straw', expanded: false },
    { term: 'CHP', definition: 'Combined Heat and Power: an energy efficient way to generate electricity whilst capturing and using the heat that would otherwise be wasted.', expanded: false },
    { term: 'CO₂e', definition: 'Carbon dioxide equivalent: a standard unit for measuring emissions by expressing the impact of all greenhouse gases (including carbon dioxide, methane and nitrous oxide) in terms of the amount of carbon dioxide that would create the same amount of atmospheric warming', expanded: false },
    { term: 'Electricity imported', definition: 'Electricity that has been generated offsite for use at your facility', expanded: false },
    { term: 'Energy efficiency', definition: 'Using less energy to perform the same task, i.e. reducing energy waste', expanded: false },
    { term: 'Fossil fuel', definition: 'Carbon-based fuels from fossil hydrocarbon deposits, including coal, peat, oil, and natural gas. Fossil fuels produce carbon dioxide (CO2) when burned, which is a greenhouse gas', expanded: false },
    { term: 'GPRN', definition: 'Gas Point Registration Number (GPRN): a unique reference number assigned to every gas point on the natural gas network. A gas point is a point where gas is taken from the gas network system, measured by a meter and consumed by an end user. Each individual gas point has its own GPRN. GPRNs have up to 7 digits.', expanded: false },
    { term: 'Heat pump', definition: 'Electrical devices which convert energy from the air outside of your home into useful heat, in the same way a fridge extracts heat from its inside. Different types of heat pump draw heat from different sources: air, water or the ground.', expanded: false },
    { term: 'kWh', definition: 'Kilowatt hour: a unit of energy, equivalent to operating a 1,000 watt appliance running for one hour.', expanded: false },
    { term: 'LPG', definition: 'Liquefied Petroleum Gas is manufactured in oil refining, crude oil stabilisation and natural gas processing plants and consists of propane and/or butane gases. Typically used in boilers and for cooking.', expanded: false },
    { term: 'Maximum Import Capacity (MIC)', definition: 'The upper limit on the total electrical demand that a consumer can place on the network system.', expanded: false },
    { term: 'MPRN', definition: 'A Meter Point Reference Number (MPRN) is a unique 11-digit number assigned to every single electricity connection and meter in the country. Each individual meter has its own MPRN.', expanded: false },
    { term: 'Natural gas', definition: 'Natural gas is a naturally occurring fossil fuel that is composed mainly of methane. It is piped through a national gas transmission & distribution network (in gaseous form, under pressure) directly to end users in the industrial, power generation, services and domestic sectors.', expanded: false },
    { term: 'Renewable energy', definition: 'Energy from renewable non-fossil fuel sources, e.g. wind, solar (both solar thermal and solar photovoltaic) and geothermal energy, ambient energy, tide, wave and other ocean energy, hydropower, biomass, and biogas', expanded: false },
    { term: 'Solar photovoltaics', definition: 'Also called “solar PV”, solar panels that generate electricity when exposed to sunlight', expanded: false },
    { term: 'Thermal energy', definition: 'Thermal energy refers to all solid, liquid and gas fuels used for non-transport purposes. This includes both fossil and renewable fuels used in boilers, space & process heating systems, catering, fuel-based electricity generators (onsite), CHP and in all plant, equipment & other non-road mobile vehicles.', expanded: false },
  ];

  toggleDefinition(item: any) {
    item.expanded = !item.expanded;
  }
}
