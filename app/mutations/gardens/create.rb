module Gardens
  class Create < Mutations::Command
    required do
      string :name
      model  :device_id, class: Device
    end

    optional do
    end

    def execute
      Garden.create!(inputs)
    end
  end
end
